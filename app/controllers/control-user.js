"use strict";

app.controller("userCtrl", function($scope, $q, $http, $window, $location,  userFactory, Spotify){

	$scope.albums = [];
	$scope.songSearch = {
		song: ""
	};

	// $scope.login = function() {
	// 	Spotify.login();
	// };

	// $scope.getUserData = function() {
	// 	Spotify.getCurrentUser()
	//     .then(function (data) {
	// 	  console.log(data);
	// 	});
	// };

	// $scope.getTopArtists = function() {
	// 	Spotify.getUserTopArtists({ limit: 50 }).then(function (data) {
	// 	  console.log(data);
	// 	});
	// };

	// $scope.getAlbums = function() {
	// 	console.log("Get Albums Clicked!");
	// 	Spotify.getArtistAlbums('4TMHGUX5WI7OOm53PqSDAT')
	//     .then(function (data) {
	//       $('.targetCollection').html("");
	//       $scope.albums = data.data.items;
	//       console.log($scope.albums);
	//       $scope.albums.forEach((element, index) => {
	//       	$('.targetDiv').append(`
	//       		<div class="col s4">
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

	// $scope.searchSong = function() {
	// 	Spotify.search(`'${$scope.songSearch.song}', 'Grateful Dead'`, 'track,artist')
	// 	.then(function (data) {
	// 	$('.targetDiv').html("");
	//   	$('.targetCollection').html("");
	// 	  console.log(data.data.tracks.items);
	// 	  $scope.searchedSongs = data.data.tracks.items;
	// 	  $scope.searchedSongs.forEach((element, index) => {
	//       	$('.targetCollection').append(`
	// 			    <li>
	// 			    	<iframe src="https://open.spotify.com/embed?uri=spotify:track:${$scope.searchedSongs[index].id}" width="100%" height="80" frameborder="0" allowtransparency="true"></iframe>
	// 			    </li>`);
	//       	});
	// 	});
	// };

				    // <li class="collection-item avatar">
				    //   <img src="images/yuna.jpg" alt="" class="circle">
				    //   <span class="title">${$scope.searchedSongs[index].name}</span>
				    //   <p><a href="${$scope.searchedSongs[index].external_urls.spotify}" class="truncate" target="_blank">Listen on Spotify</a>
				    //   </p>
				    //   <a href="#!" class="secondary-content"><i class="material-icons">grade</i></a>
				    // </li>
	// $scope.getAlbums();

});









