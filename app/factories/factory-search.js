"use strict";

app.factory("searchFactory", function($q, $rootScope, FBCreds, Spotify) {

	var albums = [];
	var songSearch = { song: "" };
	var searching;
	var searchedSongs;

	/* search Spotify for track names. Adds Grateful Dead as the artist automatically */
	const searchSong = function() {
		searching = true;
		Spotify.search(`'${songSearch.song}', 'Grateful Dead'`, 'track,artist')
		.then(function (data) {
		$('.targetDiv').html("");
	  	$('#targetCollection').html("");
		  console.log(data.data.tracks.items);
		  searchedSongs = data.data.tracks.items;
		  searchedSongs.forEach((element, index) => {
			$(function () {
			  $(`#rateYo--${index}`).rateYo({
			    starWidth: "20px"
			  });
			});
			$(document).ready(function(){
			    $('.collapsible').collapsible();
			  });
	      	$('#targetCollection').append(`
				    <li>
				    	<iframe src="https://open.spotify.com/embed?uri=spotify:track:${searchedSongs[index].id}" width="100%" height="80" frameborder="0" allowtransparency="true"></iframe>
					    <div id="rateYo--${index}" class="right ratings"></div>
					    <ul class="collapsible" data-collapsible="accordion">
						    <li>
						      <div class="collapsible-header">Comments</div>
						      <div class="collapsible-body">
								<div class="row">
								    <form class="col s12">
								      <div class="row">
								        <div class="input-field col s6">
								          <input placeholder="Your Name" id="first_name" type="text" class="validate">
								        </div>
								      </div>
								      <div class="row">
								        <div class="col s12">
								          <div class="input-field col s12">
								          <textarea  placeholder="Your Comment" id="textarea1" class="materialize-textarea"></textarea>
								        </div>
								        </div>
								      </div>
								    </form>
							    </div>
						      </div>
						    </li>
						</ul>
				    </li>`);
	      	});
		});
	};

	return { searchSong };

});