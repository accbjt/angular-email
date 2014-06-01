var app = angular.module("myApp", []);

app.config(function($routeProvider) {
    $routeProvider.when('/', {
            templateUrl: "templates/home.html",
            controller: "HomeController"
    })
    .when('/settings', {
        templateUrl: "templates/settings.html",
        controller: "SettingsController"
    })
    .otherwise({ redirectTo: '/' })
});

app.service('mailService', ['$http', '$q', function($http, $q) {
    var getMail = function() {
        // using the angular http services to GET data from backend
        return $http({
            method: 'GET',
            url: '/api/mail'
        });
    };

    var sendEmail = function(mail) {
        var d = $q.defer();
        $http({
            method: 'POST',
            data: mail,
            url: '/api/send'
        }).success(function(data, status, headers) {
            d.resolve(data);
        }).error(function(data, status, headers) {
            d.reject(data);
        });
        return d.promise;
    };

    return {
        getMail: getMail,
        sendEmail: sendEmail
    };
}]);

app.controller('HomeController', function($scope){
    $scope.selectedMail;

    $scope.setSelectedMail = function(mail) {
        $scope.selectedMail = mail;
    };

    $scope.isSelected = function(mail) {
        if ($scope.selectedMail) {
            return $scope.selectedMail === mail;
        }
    }
});

app.directive('emailListing', function() {
   return{
       restrict: 'EA',
       replace: false,
       scope: {
            email: '=', // accept an object
           action: '&', //accept a function
           shouldUseGravater: '@' //accept as string
       },
       templateUrl: '/templates/emailListing.html',
       controller: ['$scope', '$element', '$attrs', '$transclude',
           function ($scope, $element, $attrs, $transclude) {
               $scope.handleClick = function() {
                   $scope.action({selectedMail: $scope.email});
               };
           }
       ]
   }
});

app.controller('MailListingController', ['$scope', 'mailService', function($scope, mailService){
    $scope.email = [];

    mailService.getMail()

    //setting the data to the mail.json file
    .success(function(data, status, headers){
        $scope.email = data.all;
    })
    .error(function(data, status, headers){

    });
}]);

app.controller('ContentController', [ '$scope', 'mailService','$rootScope', function($scope, mailService, $rootScope){
    $scope.showingReply = false;
    $scope.reply = {};

    $scope.toggleReplyForm = function() {
        $scope.showingReply = !$scope.showingReply;
        $scope.reply = {};
        $scope.reply.to = $scope.selectedMail.from.join(", ");
        $scope.reply.body = "\n\n --------------------\n\n" + $scope.selectedMail.body;
    };

    $scope.sendReply = function() {
        $scope.showingReply = false;
        $rootScope.loading = true;
        mailService.sendEmail($scope.reply)
            .then(function(status){
                $rootScope.loading = false;
            }, function(error){
                $rootScope.loading = false;
            });
    };

    $scope.$watch('selectedMail', function(evt) {
        $scope.showingReply = false;
        $scope.reply = {};
    });

}]);


app.controller('SettingsController', function($scope){
    $scope.settings = {
        name: 'Ari',
        email: 'ari@gmail.com'
    };

    $scope.updateSettings = function() {
        console.log ('updateSettings was called');
    }
});