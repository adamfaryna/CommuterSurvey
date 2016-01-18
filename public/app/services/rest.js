app.service('RestService', ['$http', function($http) {
	'use strict';

	return {
		call: function (serviceName, method, data, onSuccess, onFailure) {
	    $http({
	        url: 'http://localhost:5000/' + serviceName,
	        method: method,
	        data: data,
	        headers: {
	            'Content-Type': 'application/json'
	        }
	    }).then(onSuccess, onFailure || angular.noop);
		}
	};
}]);