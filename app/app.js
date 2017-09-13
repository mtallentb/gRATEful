"use strict";


const app = angular.module("gRATEful", ["ngRoute" , "spotify"]);

/* initializes firebase */
app.run(function (FBCreds) {
    firebase.initializeApp(FBCreds);
});

app.config(function (SpotifyProvider, SpotifyCreds) {
  SpotifyProvider.setClientId(`${SpotifyCreds.client_id}`);
  SpotifyProvider.setRedirectUri(`${SpotifyCreds.redirect_uri}`);
  SpotifyProvider.setScope('user-read-private playlist-read-private playlist-modify-private playlist-modify-public');
});
