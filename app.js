var myApp = angular.module('myApp', ['ngRoute']);

myApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
      when('/forecast/:city', {
        templateUrl: 'forecast/forecast.html',
        controller: 'forecastController'
      }).
     otherwise({redirectTo: 'forecast/Hyderabad'});
    //$scope.city = $routeProvider.city;
   // $routeProvider.when('/').redirectTo;
  }]);

myApp.service('weatherService', function($http) {
    var self = this;
    this.getWeather  = function(city, callback) {
         $http.get('https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22'+city+'%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys').success(function(result){
           // console.log(result);
            callback(result);
            self.setCity(city);
        })
        .error(function(data,status)
              {
            console.error(data);
        })
    }
    var city;
    this.getCity = function() {
        return self.city;
    };
    this.setCity = function(city) {
        self.city=city;
    };
    
});

myApp.controller('mainController', ['$scope','$routeParams','$filter','weatherService','$rootScope', function($scope, $routeParams, $filter, weatherService, $rootScope) {
    $scope.cities = ['Hyderabad','Bengaluru','Chennai','Vijayawada'];
    $scope.createdDate = moment(new Date()).format('LLL');
}]);

myApp.controller('forecastController', ['$scope','$routeParams','weatherService', '$rootScope', function($scope, $routeParams, weatherService, $rootScope) {
        $scope.forecast=true;
        $scope.loading=true;
        var city = $routeParams.city;
        $rootScope.city = city;
        weatherService.getWeather(city, function(result){
            $scope.forecast = result.query&&result.query.results&&result.query.results.channel.item.forecast;
            $scope.loading=!$scope.forecast;
            $scope.loading=false;
        });
    }]);
    