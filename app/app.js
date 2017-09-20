"use strict";


const app = angular.module("gRATEful", ["ngRoute" , "spotify"]);

/* initializes firebase */
app.run(function (FBCreds) {
    firebase.initializeApp(FBCreds);
});

/* this allows the Spotify urls to be trusted by angular */
app.filter('trustAsResourceUrl', ['$sce', function($sce) {
    return function(val) {
        return $sce.trustAsResourceUrl(val);
    };
}]);

/* checks to see if the user is already logged in. displays links based on status */
const isAuth = (userFactory) => userFactory.isAuthenticated();

app.config(($routeProvider, SpotifyProvider, SpotifyCreds) => {

    $routeProvider 
    .when('/', {
        templateUrl: 'partials/search.html',
        controller: 'searchCtrl'
        // resolve: {isAuth}
    })
    .when('/show-all-albums', {
        templateUrl: 'partials/show-albums.html',
        controller: 'showAlbumsCtrl'
        // resolve: {isAuth}
    })
    .otherwise('/');

    SpotifyProvider.setClientId(`${SpotifyCreds.client_id}`);
    SpotifyProvider.setRedirectUri(`${SpotifyCreds.redirect_uri}`);
    SpotifyProvider.setScope('user-read-private playlist-read-private playlist-modify-private playlist-modify-public');

});



