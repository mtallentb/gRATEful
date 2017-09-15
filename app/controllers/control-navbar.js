"use strict";

app.controller("navbarCtrl", function($scope, $q, $window, $location, userFactory, Spotify, $route){

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

	// /* show list of Grateful Dead albums */
	// $scope.getAlbums = function() {
	// 	console.log("Get Albums Clicked!");
	// 	Spotify.getArtistAlbums('4TMHGUX5WI7OOm53PqSDAT')
	//     .then(function (data) {
	//       $('#targetCollection').addClass('hide');
	//       $scope.albums = data.data.items;
	//       console.log($scope.albums);
	//       $scope.albums.forEach((element, index) => {
	//       	$('.targetDiv').append(`
	//       		<div class="col s12 m4">
	// 	      		<div class="card">
	// 		            <div class="card-image">
	// 		              <img src="${$scope.albums[index].images[0].url}">
	// 		            </div>
	// 		            <div class="card-action">
	// 		              <a href="${$scope.albums[index].external_urls.spotify}" class="truncate" target="_blank">${$scope.albums[index].name}</a>
	// 		            </div>
	// 		        </div>
	// 	        </div>`);
	//       });
	//     });
	// };


	// /* search Spotify for track names. Adds Grateful Dead as the artist automatically */
	// $scope.searchSong = function() {
	// 	$scope.searching = true;
	// 	Spotify.search(`'${$scope.songSearch.song}', 'Grateful Dead'`, 'track,artist')
	// 	.then(function (data) {
	// 	$('.targetDiv').html("");
	//   	$('#targetCollection').html("");
	// 	  console.log(data.data.tracks.items);
	// 	  $scope.searchedSongs = data.data.tracks.items;
	// 	  $scope.searchedSongs.forEach((element, index) => {
	// 		$(function () {
	// 		  $(`#rateYo--${index}`).rateYo({
	// 		    starWidth: "20px"
	// 		  });
	// 		});
	// 		$(document).ready(function(){
	// 		    $('.collapsible').collapsible();
	// 		  });
	//       	$('#targetCollection').append(`
	// 			    <li>
	// 			    	<iframe src="https://open.spotify.com/embed?uri=spotify:track:${$scope.searchedSongs[index].id}" width="100%" height="80" frameborder="0" allowtransparency="true"></iframe>
	// 				    <div id="rateYo--${index}" class="right ratings"></div>
	// 				    <ul class="collapsible" data-collapsible="accordion">
	// 					    <li>
	// 					      <div class="collapsible-header">Comments</div>
	// 					      <div class="collapsible-body">
	// 							<div class="row">
	// 							    <form class="col s12">
	// 							      <div class="row">
	// 							        <div class="input-field col s6">
	// 							          <input placeholder="Your Name" id="first_name" type="text" class="validate">
	// 							        </div>
	// 							      </div>
	// 							      <div class="row">
	// 							        <div class="col s12">
	// 							          <div class="input-field col s12">
	// 							          <textarea  placeholder="Your Comment" id="textarea1" class="materialize-textarea"></textarea>
	// 							        </div>
	// 							        </div>
	// 							      </div>
	// 							    </form>
	// 						    </div>
	// 					      </div>
	// 					    </li>
	// 					</ul>
	// 			    </li>`);
	//       	});
	// 	});
	// };
});







