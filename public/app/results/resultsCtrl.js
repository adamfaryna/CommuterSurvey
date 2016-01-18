app.controller('ResultsCtrl', ['$scope', '$state', function($scope, $state) {
	'use strict';
	
  $scope.voteAgain = function() {
    $state.go('survey');
  };

  (function() {
    RestService.call('listSurveys', 'GET', null, function(data) {
      $scope.transportTypes = JSON.parse(data.data);
    });
  })();
}]);