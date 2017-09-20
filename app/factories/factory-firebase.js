"use strict";

app.factory("firebaseFactory", function($q, $http, $rootScope, FBCreds) {

    const url = FBCreds.databaseURL;
    const db = firebase.database();
    const songData = [];

	/* returns current user's firebase ugly ID */
	const getCurrentUser = function() {
	    if (firebase.auth().currentUser === null) {
	      //create function somewhere that forces user to login
	    } else {
	      return firebase.auth().currentUser.uid;
	    }
	};
    
    const currentUserID = getCurrentUser();

    // helper function to process the firebase object
    // into an array with it's ugly id assigned as its local id
    const makeArray = function(object){
        return Object.keys(object).map(key => {
            object[key].id = key;
            return object[key];
        });
    };

    const getSongData = function(uglyID){
    	console.log("The UglyID", uglyID);
        return $q((resolve, reject)=>{
            $http.get(`${url}/items/${uglyID}.json`)
                .then(items => {
                	console.log("Data from getSongData()", items);
                	resolve(items.data);
                })
                .catch(error => reject(error));
        });
    };

    const addSongData = function(uglyID, obj) {
        let newObj = JSON.stringify(obj);
        return $http.post(`${url}/items/${uglyID}.json`, newObj)
        .then( (data) => {
            // console.log("data", data);
            return (data);
        }, (error) => {
            console.log("error");
        });
    };

    const editRating = function(uglyID, uglySongID, obj) {
        return $q((resolve, reject)=>{
            let newObj = JSON.stringify(obj);
            $http.patch(`${url}/items/${uglyID}/${uglySongID}.json`, newObj)
                .then(data=> resolve(data))
                .catch(error => reject(error));
        });
    };

    const rateSong = function(uglySongID, rating) {
	    let dbRef = db.ref(`/${uglySongID}`);
	    dbRef.update({
	      rating: rating
	    });
    };

    const updateFavorites = function(uglyID, uglySongID, obj) {
        return $q((resolve, reject)=>{
            let newObj = JSON.stringify(obj);
            $http.patch(`${url}/items/${uglyID}/${uglySongID}.json`, newObj)
                .then(data=> resolve(data))
                .catch(error => reject(error));
        });
    };

	/* this pushes the user preference object to firebase. user preferences include the song's rating and whether or not it is favorited */
	const addToFavorites = function(uglySongID) {
		let currentUserID = getCurrentUser();
		db.ref().update({
			isFavorited: true
		});
	};

	const removeFromFavorites = function() {

	};



	return { getCurrentUser, addToFavorites, db, addSongData, getSongData, rateSong, editRating, updateFavorites };
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