"use strict";

app.controller("navbarCtrl", function($scope, $q, $window, $location, userFactory, firebaseFactory, Spotify, $route){

	$scope.albums = [];
	$scope.songSearch = {
		song: ""
	};

	/* Sets user to logged out at first */
    $scope.isLoggedIn = false;

    /* Checks for auth state. Updates isLoggedIn boolean */
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            $scope.isLoggedIn = true;
            console.log("Current UID", user.uid);
            $scope.$apply();
        } else {
            $scope.isLoggedIn = false;
            console.log("User is logged out");
            $location.path("/");
        }
    });

    /* logs out of Firebase */
    $scope.logOut = () => {
        userFactory.logOut()
            .then(function(data) {
                $location.path("#!/");
                $route.reload();
                $(".targetDiv").html("");
                $("#targetCollection").html("");
            }, function(error) {
                console.log("error occured on logout");
            });
    };

    /* log into Firebase */
	$scope.login = function() {
		userFactory.loginGoogle()
		.then(function(data) {
			Spotify.login();
		});
	};

	/* pulls current user data from Spotify */
	$scope.getUserData = function() {
		Spotify.getCurrentUser()
	    .then(function (data) {
		  console.log(data);
		});
	};

});







