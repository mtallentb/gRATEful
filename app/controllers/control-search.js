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
					// console.log("theSong", theSong);
					theSong.fbID = keys[keyIndex];
					// console.log("theSong.fbID", theSong.fbID);
					// console.log("theSong.songID", theSong.songID);
					// console.log("Song Rating of " + theSong.songTitle + " from FB: ", theSong.rating);
					dataFromFB.push(theSong);
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
									$scope.userSongData = {
										rating: data.rating,
										songID: element.id,
										songTitle: element.name,
										songURL: element.external_urls.spotify,
										uid: firebaseFactory.getCurrentUser()
									};
									console.log("You rated ", element.name + " a " + data.rating);
									$scope.rateSong();
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
							$scope.userSongData = {
								isFavorited: true,
								rating: data.rating,
								songID: element.id,
								songTitle: element.name,
								songURL: element.external_urls.spotify,
								uid: firebaseFactory.getCurrentUser()
							};
							console.log("You rated ", element.name + " a " + data.rating);
							$scope.rateSong();
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

	/* pushes songData to firebase */
    $scope.rateSong = function() {
    	console.log("Song Data Added!");
    	firebaseFactory.addSongData(firebaseFactory.getCurrentUser(), $scope.userSongData);
    };

    $scope.removeFromFavorites = function() {
    	$scope.userSongData.isFavorited = false;
    	firebaseFactory.db.ref().update($scope.userSongData);
    };

    $scope.getSongData = function(uglyID) {
    	firebaseFactory.getSongData(uglyID);
    };

    $scope.updateFavorites = function(songID) {
		firebaseFactory.getSongData(firebaseFactory.getCurrentUser())
		.then((data) => {
			let uglySongID;
			let songKeys = Object.keys(data);
			songKeys.forEach((item, index) => {
				let thisSong = data[item];
				console.log("thisSong", thisSong);
				if (thisSong.songID === data.uglySongID) {
					uglySongID = songKeys[index];
				}
				if (uglySongID === undefined) {
					console.log("No Data for This Song in Firebase!");
					$scope.userSongData = {
						isFavorited: true,
						rating: thisSong.rating,
						songID: thisSong.songID,
						songTitle: thisSong.songTitle,
						songURL: thisSong.songURL,
						uid: firebaseFactory.getCurrentUser()
					};
					firebaseFactory.addSongData(firebaseFactory.getCurrentUser(), $scope.userSongData);
				}
			});
		});
	};

});




  //   $scope.rateSong = function(song, rating) {
  //   	firebaseFactory.getSongData(firebaseFactory.getCurrentUser())
		// .then((data) => {
		// 	console.log("Controller Data:", data);
		// 	dataFromFB = [];
		// 	let uglySongID;
		// 	let songKeys = Object.keys(data);
		// 	songKeys.forEach((item, index) => {
		// 		let thisSong = data[item];
		// 		console.log("thisSong", thisSong);
		// 		console.log("Ugly Song Key", item);
		// 		console.log("item.songID", thisSong.songID);
		// 		dataFromFB.push(thisSong);					
		// 		if (thisSong.songID === data.songID) {
		// 			uglySongID = songKeys[index];
		// 		}
		// 		if (uglySongID === undefined) {
		// 			console.log("No Song Data inf Firebase for ", item.songTitle);
		// 			firebase.rateSong(uglySongID, rating);
		// 		} else {
		// 			console.log("Update the Rating!");

		// 		}
		// 	});
		// });
