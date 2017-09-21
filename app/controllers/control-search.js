"use strict";

app.controller("searchCtrl", function($scope, $q, $location,  userFactory, firebaseFactory, Spotify){


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
    let dataFromFB = [];

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
					console.log("theSong", theSong);
					theSong.fbID = keys[keyIndex];
					// console.log("theSong.fbID", theSong.fbID);
					// console.log("theSong.songID", theSong.songID);
					// console.log("Song Rating of " + theSong.songTitle + " from FB: ", theSong.rating);
					dataFromFB.push(theSong);
					console.log("dataFromFB", dataFromFB);
					$scope.songIDsFromFB.push(theSong.songID);
					// ratingsFromFB.push(theSong.rating);
					// console.log("Key index:", keyIndex);
				});	
			}
		});


		Spotify.search(`'${$scope.songSearch.song}', 'Grateful Dead'`, 'track,artist')
		.then(function (data) {
			
			/* initializes materialize collapsible list functionality */
			$(document).ready(function(){
			    $('.collapsible').collapsible();	
			});

			dataFromSpotify.length = 0;
			// $scope.userSongData = {};
			$scope.searchedSongs = data.data.tracks;

			// console.log("Spotify Data", data.data.tracks.items);

			$scope.searchedSongs.items.forEach((element, index) => {

				// console.log("Searched Song Items", element);

				if ($scope.songIDsFromFB.indexOf(element.id) !== -1) {

					dataFromFB.forEach((item, position) => {
						if (item.songID === element.id) {
							$(function () {
			  					$(`#rateYo--${index}`).rateYo({  
			  						rating:  item.rating,
					                starWidth: "20px",
					                spacing: "7px",
					                ratedFill: "#2196f3"
			  					})
			  					.on("rateyo.set", function (e, data) {
									let userSongData = {
										rating: data.rating,
										songID: element.id,
										songTitle: element.name,
										songURL: element.external_urls.spotify,
										uid: firebaseFactory.getCurrentUser()
									};
									console.log("You rated ", element.name + " a " + data.rating);
									$scope.rateSong(userSongData, data.rating);
			                	});
			                });

							console.log("FB Database:", dataFromFB);
							console.log("Fav Item", item.isFavorited);
			                console.log("Item ID", item.songID);
			                console.log("Element ID", element.id);
			                // console.log('jquery Fav--', (`#fav--${item.songID}`));

			                $scope.dataFromFB = dataFromFB;
						}
					});

  				} else {
  					$(function () {
	  					$(`#rateYo--${index}`).rateYo({  
			                starWidth: "20px",
			                spacing: "7px",
			                ratedFill: "#2196f3"
	  					})
	  					.on("rateyo.set", function (e, data) {
							let userSongData = {
								rating: data.rating,
								songID: element.id,
								songTitle: element.name,
								songURL: element.external_urls.spotify,
								uid: firebaseFactory.getCurrentUser()
							};
							console.log("You rated ", element.name + " a " + data.rating);
							$scope.rateSong(userSongData, data.rating);
	                	});
	                });
  				}
			});

			/* lets the user know if no matches are found from the search input */
			if (data.data.tracks.items.length === 0) {
				$scope.noResults = true;
				console.log("No Results!");
			} else {
				// console.log("Firebase Data", dataFromFB);
				console.log("Search Data", data.data.tracks.items);
			}
	    });
	};

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
    	firebaseFactory.removeFromFB(uglySongID);
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
    			firebaseFactory.updateFavorites(uglySongID);
    			console.log("Updated " + item.name + " to your Favorites!");
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
    			console.log("Updated Rating in Firebase!");
    		} else {
    			firebaseFactory.rateSong(uglySongID, rating);
    			console.log("Added song info and rating of " + item.songTitle + "!");
    		}
    	});
    };

});


 //    $scope.updateFavorites = function(songID) {
	// 	firebaseFactory.getSongData(firebaseFactory.getCurrentUser())
	// 	.then((data) => {
	// 		let uglySongID;
	// 		let songKeys = Object.keys(data);
	// 		songKeys.forEach((item, index) => {
	// 			let thisSong = data[item];
	// 			console.log("thisSong", thisSong);
	// 			if (thisSong.songID === data.uglySongID) {
	// 				uglySongID = songKeys[index];
	// 			}
	// 			if (uglySongID === undefined) {
	// 				console.log("No Data for This Song in Firebase!");
	// 				$scope.userSongData = {
	// 					isFavorited: true,
	// 					rating: thisSong.rating,
	// 					songID: thisSong.songID,
	// 					songTitle: thisSong.songTitle,
	// 					songURL: thisSong.songURL,
	// 					uid: firebaseFactory.getCurrentUser()
	// 				};
	// 				firebaseFactory.addSongData(firebaseFactory.getCurrentUser(), $scope.userSongData);
	// 			}
	// 		});
	// 	});


