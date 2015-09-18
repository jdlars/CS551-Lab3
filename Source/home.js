var myIntroApp = angular.module('myIntroApp', ['ngRoute', 'ngAnimate']);

myIntroApp.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'home.html',
            controller: 'mainController'
        })
        .when('/about', {
            templateUrl: 'register.html',
            controller: 'registerController'
        })
        .when('/map-weather', {
            templateUrl: 'mapweather.html',
            controller: 'mapWeatherController'
        });
});

$scope.go = function (path) {
    $location.path(path);
}

myIntroApp.controller('mainController', function ($scope) {
    $scope.pageClass = 'home';
});


myIntroApp.controller('registerController', function ($scope) {
    $scope.pageClass = 'register';
});

myIntroApp.controller('mapWeatherController', function ($scope) {
    $scope.pageClass = 'mapweather';
});

angular.module('GoogleDirections', []).controller('googlemapoutput', function ($scope) {
    var map = null;
    var options = null;
    var pos = null;
    var directionsDisplay = null;
    var directionsService = null;
    directionsDisplay = new google.maps.DirectionsRenderer({
        draggable: true
    });
    directionsService = new google.maps.DirectionsService();

    $scope.initialize = function () {
        pos = new google.maps.LatLng(0, 0);
        options = {
            zoom: 3,
            center: pos
        };
        map = new google.maps.Map(document.getElementById('map-canvas'),
            options);
    };

    $scope.calculateRoute = function () {
        var end = document.getElementById('endLocation').value;
        var start = document.getElementById('startLocation').value;
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
});