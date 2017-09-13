"use strict";

app.controller("showAlbumsCtrl", function($scope, $q, $http, $window, $location,  userFactory, Spotify){

	$scope.albums = [];

	$scope.getAlbums = function() {
		console.log("Get Albums Clicked!");
		Spotify.getArtistAlbums('4TMHGUX5WI7OOm53PqSDAT')
	    .then(function (data) {
	      $('.targetCollection').html("");
	      $scope.albums = data.data.items;
	      console.log($scope.albums);
	      $scope.albums.forEach((element, index) => {
	      	$('.targetDiv').append(`
	      		<div class="col s4">
		      		<div class="card">
			            <div class="card-image">
			              <img src="${$scope.albums[index].images[0].url}">
			            </div>
			            <div class="card-action">
			              <a href="${$scope.albums[index].external_urls.spotify}" class="truncate" target="_blank">${$scope.albums[index].name}</a>
			            </div>
			        </div>
		        </div>`);
	      });
	    });
	};
});