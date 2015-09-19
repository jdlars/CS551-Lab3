var myIntroApp = angular.module('myIntroApp', ['ngRoute']);

myIntroApp.config(function ($routeProvider) {
    $routeProvider
        .when('/home', {
            templateUrl: 'home.html',
            controller: 'mainController'
        })
        .when('/register', {
            templateUrl: 'register.html',
            controller: 'registerController'
        })
        .when('/mapweather', {
            templateUrl: 'mapweather.html',
            controller: 'mapWeatherController'
        })
        .otherwise({
            redirectTo: '/home'
        });
});


myIntroApp.controller('mainController', function ($scope, $location) {
    $scope.pageClass = 'home';
    $scope.go = function(path) {
        $location.path(path);
    };
    $scope.login = function (username, password) {
        localStorage.setItem(username, password);
        $scope.go('/mapweather');
    };
});


myIntroApp.controller('registerController', function ($scope, $location) {
    $scope.pageClass = 'register';
    $scope.go = function(path) {
        $location.path(path);
    };
});

myIntroApp.controller('mapWeatherController', function ($scope, $http, $location) {
    $scope.pageClass = 'mapweather';
    $scope.go = function(path) {
        $location.path(path);
    };
    /*
    Google Map usage to get driving directions from an origin to a destination

     */
    var map;
    var mapOptions;
    var directionsDisplay = new google.maps.DirectionsRenderer({
        draggable: true
    });
    var directionsService = new google.maps.DirectionsService();

    $scope.initialize = function () {
        var pos = new google.maps.LatLng(0, 0);
        var mapOptions = {
            zoom: 3,
            center: pos
        };

        map = new google.maps.Map(document.getElementById('map-canvas'),
            mapOptions);
    };

    $scope.calculateRouteAndWeather = function() {
        var start = document.getElementById('startlocation').value;
        var end = document.getElementById('endlocation').value;
        $scope.calculateRoute(start, end);
        $scope.getWeatherResults(start);
        $scope.getWeatherResults(end);
    };

    $scope.calculateRoute = function (start, end) {

        var request = {
            origin: start,
            destination: end,
            travelMode: google.maps.TravelMode.DRIVING
        };

        directionsService.route(request, function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setMap(map);
                directionsDisplay.setDirections(response);
                console.log(status);
            }

        });
    };



    google.maps.event.addDomListener(window, 'load', $scope.initialize);
    $scope.getWeatherResults = function (cityAndState) {
        var splitStringToArray = cityAndState.split(',');
        var fullCity = splitStringToArray[0];
        var state = splitStringToArray[1];
        var cityWithUnderscores = fullCity.replace(/ /g,"_");
        var restUrl = "http://api.wunderground.com/api/36b799dc821d5836/conditions/q/" + state + "/" + cityWithUnderscores + ".json";
        console.log(restUrl);
        $http.get(restUrl).success(function(data) {
            console.log(data);
            //location = data.current_observation.full;
            temp = data.current_observation.temp_f;
            icon = data.current_observation.icon_url;
            weather = data.current_observation.weather;
            console.log(temp);
            $scope.currentweather = {html:"Currently " +temp +" &deg; F and " + weather + " in "};
            $scope.currentIcon=  {html:"<img src='" + icon  +"'/>"};

        });
    };

});