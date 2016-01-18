app.controller('SurveyCtrl', ['$scope', '$rootScope', '$state', 'RestService', function($scope, $rootScope, $state, RestService) {
  'use strict';

  $scope.transportTypes = [];

  $rootScope.userData = $rootScope.userData || {};

  if ($rootScope.userData.userName) {
    $scope.userName = $rootScope.userData.userName;
  }

  $scope.userTransport = $rootScope.userData.userTransport || 1;

  $scope.onSubmit = function() {
    var data = {
      "name": $scope.userName,
      "transportId": $scope.userTransport
    };

    RestService.call('addSurvey', 'PUT', data, function(data) {
      $rootScope.userData.userName = $scope.userName;
      $rootScope.userData.userTransport = $scope.userTransport;
      
      $state.go('results');
    });
  };

  (function() {
    RestService.call('listTransportTypes', 'GET', null, function(data) {
      $scope.transportTypes = JSON.parse(data.data);
    });
  })();
}]);