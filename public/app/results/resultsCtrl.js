app.controller('ResultsCtrl', ['$scope', '$state', 'RestService', function($scope, $state, RestService) {
	'use strict';
	
  $scope.voteAgain = function() {
    $state.go('survey');
  };

  (function() {
    RestService.call('listSurveys', 'GET', null, function(jsonData) {
      $scope.jsonData = jsonData.data;
    });
  })();
}]);