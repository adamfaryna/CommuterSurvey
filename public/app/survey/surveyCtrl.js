app.controller('surveyCtrl', ['$scope', '$state', function($scope, $state) {
  'use strict';

  // $scope.userName
  // $scope.userMood
  $scope.moodOptions = [];

  angular.forEach(['Walk', 'Cycle', 'Car', 'Train', 'Motorbike', 'Tram', 'Other'], function(item) {
    $scope.moodOptions.push(new MoodOption(item, 0));
  });

  function MoodOption(name, count) {
    this.name = name;
    this.count = count;
  }

  $scope.onSubmit = function() {
    $state.go('results');
  };
}]);