"use strict";

app.controller("searchCtrl", function($scope, $q, $http, $window, $location,  userFactory, Spotify){

	$scope.albums = [];
	$scope.songSearch = {
		song: ""
	};

	$scope.searchSong = function() {
		Spotify.search(`'${$scope.songSearch.song}', 'Grateful Dead'`, 'track,artist')
		.then(function (data) {
		$('.targetDiv').html("");
	  	$('.targetCollection').html("");
			console.log(data.data.tracks.items);
			$scope.searchedSongs = data.data.tracks.items;
			$scope.searchedSongs.forEach((element, index) => {
	      	$('.targetCollection').append(`
				    <li>
				    	<iframe src="https://open.spotify.com/embed?uri=spotify:track:${$scope.searchedSongs[index].id}" width="100%" height="80" frameborder="0" allowtransparency="true"></iframe>
				    </li>`);
	      	});
		});
	};
});