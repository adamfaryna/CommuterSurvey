app.controller('resultsCtrl', ['$scope', '$state'function($scope, $state) {

  $scope.voteAgain = function() {
    $state.go('survey');
  };

}]);