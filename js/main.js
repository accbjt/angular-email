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

app.controller('MailListingController', ['$scope', '$http', function($scope, $http){
    $scope.email = []
    // using the angular http services to GET data from backend
    $http({
        method: 'GET',
        url: '/api/mail'
    })
    //setting the data to the mail.json file
    .success(function(data, status, headers){
        $scope.email = data.all;
    })
    .error(function(data, status, headers){

    });
}]);

app.controller('ContentController', [ '$scope', function($scope){
    $scope.showingReply = false;
    $scope.reply = {};

    $scope.toggleReplyForm = function() {
        $scope.showingReply = !$scope.showingReply;
        $scope.reply = {};
        $scope.reply.to = $scope.selectedMail.from.join(", ");
        $scope.reply.body = "\n\n --------------------\n\n" + $scope.selectedMail.body;
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