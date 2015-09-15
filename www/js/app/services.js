angular.module('app.services', ['ionic'])
    .service('AppService', ['$http', '$q', function ($http , $q) {

        var _host = '';
		
		var response = function (result , response, status, headers, config){
			if (angular.isFunction(result)) {
            	result(response, status, headers, config);
			}

            if (angular.isArray(result) && angular.isArray(response)) {
				angular.forEach(response, function (v) {
					result.push(v);
				});
			}

			if (angular.isArray(result) && angular.isObject(response)) {
				result.push(response);
			}

			if (angular.isObject(result) && angular.isObject(response)) {
				angular.copy(response, result);
			}				
		};
		
        var get = function (url, id, result, f_response) {
            var q = $q.defer();

            if (id != null && id != undefined) {
               	url = url +'/'+ id;
            }

            // console.info('get' , url);

            $http.get(url)
                .success(function (response, status, headers, config) {
					f_response(result , response, status, headers, config);
                    q.resolve({ response: response, status: status });
                })
                .error(function (response, status, headers, config) {
                    q.reject({ response: response, status: status });
                });
            return q.promise;
        }

		var post = function (url , id , model , result, f_response) {
            var q = $q.defer();

            if (id != null && id != undefined) {
               	url = url +'/'+ id;
            }
			
			//url = 'http://localhost:12981/api/PublicService/Feed';
            // console.info('post', url);

            $http.post(url , model)
                .success(function (response, status, headers, config) {
					f_response(result , response, status, headers, config);
                    q.resolve({ response: response, status: status });
                })
                .error(function (response, status, headers, config) {
                    q.reject({ response: response, status: status });
                });
            return q.promise;
        }
		
		
        this.Service = function (url , id, result) {
            return get(url, id, result, response);
        };
        this.ServicePost = function(url , id , model , result){
        	return post(url , id , model , result, response);
        };
        
    }])
;
