"use strict";


const app = angular.module("gRATEful", ["ngRoute" , "spotify"]);

/* initializes firebase */
app.run(function (FBCreds) {
    firebase.initializeApp(FBCreds);
});

app.filter('trustAsResourceUrl', ['$sce', function($sce) {
    return function(val) {
        return $sce.trustAsResourceUrl(val);
    };
}]);




/* 
if a user is authenticated, resolve true, else reject false
this is returns a promise whose status is checked in the resolve
to many of the paths configure with $routeprovider in app.js
they will be injected when the controller is instantiated, 
and are available to $scope in that controller under $resolve.
else a $routeChangeError will be fired 
*/
const isAuth = (userFactory) => userFactory.isAuthenticated();

app.config(($routeProvider, SpotifyProvider, SpotifyCreds, $sceProvider) => {

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

    $sceProvider.enabled(false);
});



