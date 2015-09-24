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
        .when('/nav', {
            templateUrl: 'nav.html',
            controller: 'navigationController'
        })
        .when('/mashup', {
            templateUrl: 'mashup.html',
            controller: 'mashupController'
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
        localStorage.setItem("currentuser", username);
        $scope.go('/nav');
    };
});


myIntroApp.controller('registerController', function ($scope, $location) {
    $scope.pageClass = 'register';
    $scope.go = function(path) {
        $location.path(path);
    };
});

myIntroApp.controller('navigationController', function ($scope, $http, $location) {
    $scope.pageClass = 'nav';
    $scope.go = function(path) {
        $location.path(path);
    };
});

myIntroApp.controller('mashupController', function ($scope, $sce, $http, $location) {

    $scope.pageClass = 'mashup';
    $scope.go = function(path) {
        $location.path(path);
    };

    var init = function () {
        $scope.getBeerInfo();
    };

    $scope.getBeerInfo = function () {
        var beerUrl = "http://api.brewerydb.com/v2/brewery/avMkil/beers?withBreweries=Y&key=a309a2bb50885577a0bb30ec5a049289";
        $http.get(beerUrl).success(function (data) {

            data = data.data[0];
            name = data.nameDisplay;
            description = data.description;
            icon = data.labels.large;
            style = data.style.category.name;
            $scope.beerHeader = $sce.trustAsHtml(name + ", a " + style);
            $scope.beerDesc = $sce.trustAsHtml(description);
            $scope.currentBeerIcon = $sce.trustAsHtml("<img src='" + icon + "'/>");
            glass = data.glass.name;
            $scope.glassDirections = $sce.trustAsHtml("You should drink this beer out of a " + glass + " glass");
            glassIconUrl = $scope.getImageInfo(glass+"glass");
            $scope.currentBeerGlassIcon = $sce.trustAsHtml("<img src='" + glassIcon + "'/>");
        });
    };

    $scope.getImageInfo = function (searchString) {
        var bingKey = "73CaJawMz9TASHEb2qA3PPVMgOKwWliCzOf3vHIJ83o";
        var bingSecret = "a1b8d824-d982-4590-8ddd-20d7685f1712";
        //var pintGlassSearchUrl = "https://www.googleapis.com/customsearch/v1?" +
        //    "key=AIzaSyB0QzRNd0TQNbEfj43nRPHy9AugGiN_www&cx=011770114445841947957:fopd-9dvqks&q=" + searchString;
        //var pintGlassSearchUrl = "https://api.datamarket.azure.com/Bing/Search/v1/Composite?" +
        //    "AppId=" + bingKey +
        //    "&Sources=%27image%27&Query=%27pint%20glass%27";
        var pintGlassSearchUrl = "http://api.bing.net/json.aspx?AppId=" + bingKey +
            "&Query=" + searchString + "%20site:microsoft.com&Sources=Image&Version=2.0" +
            "&Market=en-us&Adult=Moderate&Image.Count=10&Image.Offset=0&JsonType=callback&JsonCallback=SearchCompleted"
        $http.get(pintGlassSearchUrl).success(function (data) {
            console.log(data);
        });
    };

    init();
});

myIntroApp.controller('mapWeatherController', function ($scope, $http, $location, $sce) {
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
            $scope.currentWeather = $sce.trustAsHtml("Currently " +temp +" &deg; F and " + weather + " in " + fullCity);
            $scope.currentIcon=  $sce.trustAsHtml("<img src='" + icon  +"'/>");

        });
    };

});