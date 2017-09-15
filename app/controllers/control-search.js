"use strict";

app.controller("searchCtrl", function($scope, $q, $location,  userFactory, firebaseFactory, Spotify){

	
	/* ng-model to search input field */
	$scope.songSearch = {
		song: ""
	};

	/* defines $scope.searchedSongs array and sets its length to 0 so that ng-repeat loops over nothing */
	$scope.searchedSongs = [];


	/* hides collection of results using ng-show */
	$scope.showResults = false;

	/* sets user to logged out at first */
    $scope.isLoggedIn = false;

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


		/* uses ng-show to show the collection of embedded Spotify songs */
		$scope.showResults = true;

		Spotify.search(`'${$scope.songSearch.song}', 'Grateful Dead'`, 'track,artist')
		.then(function (data) {

				console.log("Data:", data);

			  	/* rating functionality using rateYo plugin */
				$(function () {
				  $(`#rateYo`).rateYo({
				    starWidth: "20px",
				    ratedFill: "#2196f3"
				  })
				  .on("rateyo.set", function (e, data) {
					$scope.userSongData.rating = data.rating;
					console.log("Current Song:", $scope.searchedSongs.items);
					console.log("Current Rating:", data.rating);
			      });
				});

				/* initializes materialize collapsible list functionality */
				$(document).ready(function(){
				    $('.collapsible').collapsible();	
				});

		  	  console.log("Check This:", data.data.tracks);
			  console.log(data.data.tracks.items);
			  $scope.searchedSongs = data.data.tracks;

		    /* lets the user know if no matches are found from the search input */
		    if (!$scope.searchedSongs.items) {
		  		$scope.noResults = true;
		  		console.log("No Results!");
		    } else {
				$scope.searchedSongs.items.forEach((element, index) => {

					/* object that stores user preferences for each song to be pushed to firebase using firebaseFactory */
					
					$scope.userSongData = {
							uid: firebaseFactory.getCurrentUser(),
				        	rating: "",
				        	songID: $scope.searchedSongs.items[index].id,
				        	songURL: `https://open.spotify.com/embed?uri=spotify:track:${$scope.searchedSongs.items[index].id}`,
				        	isFavorited: true  
				    };

				    /* adding to favorites list on click of the heart icon */
				    $scope.addToFavorites = function() {
				    	console.log("Added to Favorites!");
				    	firebaseFactory.db.ref().push($scope.userSongData);
				    };
		      // 	});
		      	});
			}
		});
	};

    $scope.removeFromFavorites = function() {
    	$scope.userSongData.isFavorited = false;
    };

});
 



					/* list of embedded Spotify songs */
			  //    $('#targetCollection').append(`
					// 	    <li id="song-${$scope.searchedSongs[index].id}">
					// 	    	<iframe src="https://open.spotify.com/embed?uri=spotify:track:${$scope.searchedSongs[index].id}" width="100%" height="80" frameborder="0" allowtransparency="true"></iframe>
					// 		    <a ng-click="addToFavorites()"><i class="small favs right material-icons">favorite</i></a>
					// 		    <div id="rateYo--${index}" class="right ratings"></div>
					// 		    <ul class="collapsible" data-collapsible="accordion">
					// 			    <li>
					// 			      <div class="collapsible-header">Comments</div>
					// 			      <div class="collapsible-body">
					// 					<div class="row">
					// 					    <form class="col s12">
					// 					      <div class="row">
					// 					        <div class="input-field col s6">
					// 					          <input placeholder="Your Name" id="first_name" type="text">
					// 					        </div>
					// 					      </div>
					// 					      <div class="row">
					// 					        <div class="col s12">
					// 					          <div class="input-field col s12">
					// 					            <textarea  placeholder="Your Comment" id="textarea1" class="materialize-textarea"></textarea>
					// 					          </div>
					// 					        </div>
					// 					      </div>
					// 					      <div class="row">
					// 							<a id="submit-${$scope.searchedSongs[index].id}" class="waves-effect waves-light btn blue darken-2" ng-click="submitUserSongData()">Submit</a>
					// 					      </div>
					// 					    </form>
					// 				    </div>
					// 			      </div>
					// 			    </li>
					// 			</ul>
					// 	    </li>`);

    // /* submits user's song preference (rating and favorited status) to firebase */
    // $scope.submitUserSongData = function() {
    //     firebaseFactory.addUserSongData($scope.userSongData)
    //     .then((data) => {
    //         console.log('data');
    //     });
    // }; 