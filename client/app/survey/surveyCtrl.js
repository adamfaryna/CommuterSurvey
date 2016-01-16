app.controller('surveyCtrl', ['$scope', function($scope) {
  'use strict';

  // $scope.userName
  // $scope.userMood
  $scope.moodOptions = [];

  angular.forEach(['Walk', 'Cycle', 'Car', 'Train', 'Motorbike', 'Tram', 'Other'], function (item) {
		$scope.moodOptions.push(new MoodOption(item, 0));
  });

  function MoodOption(name, count) {
  	this.name = name;
  	this.count = count;
  }

  $scope.submit = function () {

  };

}]);
