"use strict";

app.factory("firebaseFactory", function($q, $http, $rootScope, FBCreds) {

    const url = FBCreds.databaseURL;
    const db = firebase.database();

	/* returns current user's firebase ugly ID */
	const getCurrentUser = function() {
	    if (firebase.auth().currentUser === null) {
	      //create function somewhere that forces user to login
	    } else {
	      return firebase.auth().currentUser.uid;
	    }
	};
    
    const currentUserID = getCurrentUser();

	/* this pushes the user preference object to firebase. user preferences include the song's rating and whether or not it is favorited */
	const addToFavorites = function(songObj) {
		db.ref().push({
			title: songObj.name,
			songID: songObj.id,
			songURL: songObj.external_urls.spotify,
			uid: currentUserID,
			rating: songObj.rating
		});
	};

	const removeFromFavorites = function() {

	};



	return { getCurrentUser, addToFavorites, db };
});



    // const addUserSongData = function(obj){
    //     return $http.post(`${url}/items.json`, newObj)
    //         .then(data => data)
    //         .catch(error => console.log("error", error.message));
    // };

    /* updates a song's rating on firebase */

 //    const rateSong = function(uglyID, songID, rating) {
	//     let dbRef = db.ref();
	//     let userKey = dbRef.push({}).getKey();
	//     let songKey = db.ref(`/${userKey}`).push({}).getKey();
	//     db.ref(`/${userKey}/${songKey}`).set({

	//     })
	// };