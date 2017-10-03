"use strict";

app.controller("favoritesCtrl", function($scope, $q, $location,  userFactory, firebaseFactory, Spotify){


	/* ng-model to search input field */
	$scope.songSearch = { song: "" };

	/* defines $scope.searchedSongs array and sets its length to 0 so that ng-repeat loops over nothing */
	$scope.searchedSongs = [];

	/* hides collection of results using ng-show */
	$scope.showResults = false;

	/* sets user to logged out at first */
    $scope.isLoggedIn = false;

    /* hides the div containing 'No Results Found' to begin with */
    $scope.noResults = false;

    /* initiates favorited status */
    $scope.isFavorited = false;

    /* declares an open array to hold data from firebase */
    $scope.dataFromFB = [];

    let ratingsFromFB = [];

    $scope.songIDsFromFB = [];

    /* declares an open array to hold data from Spotify */
    let dataFromSpotify = [];

    let theSong;

    /* gets user ID from firebase */
    const user = firebaseFactory.getCurrentUser();

    /* checks for auth state. updates isLoggedIn boolean */
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            $scope.isLoggedIn = true;
            $scope.$apply();
        } else {
            $scope.isLoggedIn = false;
            $location.path("/");
        }
    });

    /* scoped reference to firebase push function */
	$scope.addToFavorites = function(songObj) {
		firebaseFactory.addToFavorites(songObj);
	};

	/* search Spotify for track names. adds Grateful Dead as the artist automatically */
	$scope.searchSong = function() {

		$(document).ready(function(){
		    $('.collapsible').collapsible();	
		});
        
        /* initializes materialize collapsible list functionality */
 
        /* makes sure 'No Results Found' is hidden */
        $scope.noResults = false;

        /* uses ng-show to show the collection of embedded Spotify songs */
        $scope.showResults = true;

        /* retrieves data from firebase */
        firebaseFactory.getSongData(firebaseFactory.getCurrentUser())
        .then((FBdata) => {
            if (FBdata) {
                let keys = Object.keys(FBdata);
                keys.forEach((keyItem, keyIndex) => {
                    theSong = FBdata[keyItem];
                    // console.log("theSong", theSong);
                    theSong.fbID = keys[keyIndex];
                    // console.log("theSong.fbID", theSong.fbID);
                    // console.log("theSong.songID", theSong.songID);
                    // console.log("Song Rating of " + theSong.songTitle + " from FB: ", theSong.rating);
                    $scope.dataFromFB.push(theSong);
                    $scope.songIDsFromFB.push(theSong.songID);
                    // ratingsFromFB.push(theSong.rating);
                    // console.log("Key index:", keyIndex);
                }); 
                console.log("dataFromFB", $scope.dataFromFB);
            }
        });

        $scope.dataFromFB.forEach((item, position) => {
            console.log("FB ITEM: ", item);
			$(function () {
				$(`#rateYo--${position}`).rateYo({  
					rating:  item.rating,
	                starWidth: "20px",
	                spacing: "7px",
	                ratedFill: "#2196f3"
				})
				.on("rateyo.set", function (e, data) {
					let rating = data.rating;
					console.log("You rated ", item.songTitle + " a " + data.rating);
					$scope.rateSong(data.rating);
        		});
        	});	
		});
	};

	$scope.searchSong();

    $scope.removeFromFavorites = function(item) {
    	firebaseFactory.getSongData()
    	.then((songData) => {
	    	let uglySongID;
			let songKeys = Object.keys(songData);
			songKeys.forEach((element, index) => {
				let thisSong = songData[element];
				// console.log("this song from rateSong()", thisSong);
				if (thisSong.songID === item.songID) {
					uglySongID = songKeys[index];
				}
			});
    	firebaseFactory.removeFromFavorites(uglySongID);
    	console.log("You removed " + item.songTitle + " from your favorites!");
		});


    	// firebaseFactory.db.ref().update($scope.userSongData);
    };

    $scope.addToFavorites = function(item) {
    	console.log("Item from Partial:", item);
    	firebaseFactory.getSongData()
    	.then((songData) => {
    		// console.log("songData:", songData);
    		let uglySongID;
    		let songsArr = [];
    		let songKeys = Object.keys(songData);
    		songKeys.forEach((element, index) => {
    			let thisSong = songData[element];
    			if (thisSong.songID === item.id) {
    				uglySongID = songKeys[index];
    			}
    			// console.log("this song:", thisSong);
    			songsArr.push(thisSong.songID);
    		});
    		if (songsArr.indexOf(item.id) === -1) {
    			firebaseFactory.addToFavorites(item);
    			console.log("Added " + item.name + " to Favorites List!");
    		} else if (songsArr.indexOf(item.id) != -1) {
    			// firebaseFactory.updateFavorites(uglySongID);
    			console.log("Updated " + item.name + "to your Favorites!");
    		}
    		// $scope.isFavorited = true;
    	});
    };

    $scope.rateSong = function(item, rating) {
    	// console.log("item from rateSong", item);
    	firebaseFactory.getSongData()
    	.then((songData) => {
    		// console.log("rateSong data", songData);
    		let uglySongID;
    		let songKeys = Object.keys(songData);
    		songKeys.forEach((element, index) => {
    			let thisSong = songData[element];
    			// console.log("this song from rateSong()", thisSong);
    			if (thisSong.songID === item.songID) {
    				uglySongID = songKeys[index];
    			}
    		});
    		if (uglySongID === undefined) {
    			item.rating = rating;
    			firebaseFactory.addRating(item, rating);
    			console.log("Added song info and rating of " + item.songTitle + "!");
    		} else {
    			firebaseFactory.rateSong(uglySongID, rating);
    			console.log("Updated Rating in Firebase!");
    		}
    	});
    };

});


