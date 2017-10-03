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

    const getVotes = function() {
        return $q((resolve, reject)=>{
            let userID = getCurrentUser();
            if (userID === undefined) {
                return;
            } else {
                $http.get(`${url}/votes/.json`)
                    .then(items => {
                        // console.log("Vote Data", items.data);
                        resolve(items.data);
                    })
                    .catch(error => {
                        console.log("ERROR WITH VOTES");
                        reject(error);
                    });
            }
        });
    };

    const addUpVote = function(item) {
        db.ref(`/votes/`).push({
            vote: 1,
            songID: item.id,
            songTitle: item.name
        });
    };

    const addDownVote = function(item) {
        db.ref(`/votes/`).push({
            vote: -1,
            songID: item.id,
            songTitle: item.name
        });
    };

    const updateUpVote = function(uglySongID, vote) {
        db.ref(`/votes/${uglySongID}/`).update({
            vote: vote + 1
        });
    };

    const updateDownVote = function(uglySongID, vote) {
        db.ref(`/votes/${uglySongID}/`).update({
            vote: vote - 1
        });
    };

    const getSongData = function(){
        return $q((resolve, reject)=>{
            let userID = getCurrentUser();
            console.log("The UserID", userID);
            if (userID === undefined) {
                return;
            } else {
                $http.get(`${url}/items/${userID}.json`)
                    .then(items => {
                        console.log("Data from getSongData()", items);
                        resolve(items.data);
                    })
                    .catch(error => reject(error));
            }
        });
    };

    const addToFavorites = function(songObj) {
        let userID = getCurrentUser();
        db.ref(`/items/${userID}`).push({
            isFavorited: true,
            songID: songObj.id,
            songTitle: songObj.name,
            songURL: songObj.external_urls.spotify,
            uid: getCurrentUser(),
            inFB: true
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
        let userID = getCurrentUser();
        let dbRef = db.ref(`/items/${userID}/${uglySongID}/`);
        dbRef.update({
          rating: rating
        });
    };


    const addRating = function(songObj, rating) {
        let userID = getCurrentUser();
        let dbRef = db.ref(`/items/${userID}/`);
        dbRef.push({
            rating: rating,
            songID: songObj.songID,
            songTitle: songObj.songTitle,
            songURL: songObj.songURL,
            uid: userID,
            inFB: true
        });
    };

    // const updateFavorites = function(uglyID, uglySongID, obj) {
    //     return $q((resolve, reject)=>{
    //         let newObj = JSON.stringify(obj);
    //         $http.patch(`${url}/items/${uglyID}/${uglySongID}.json`, newObj)
    //             .then(data=> resolve(data))
    //             .catch(error => reject(error));
    //     });
    // };

	/* this pushes the user preference object to firebase. user preferences include the song's rating and whether or not it is favorited */
	const updateFavorites = function(uglySongID , songObj) {
        let userID = getCurrentUser();
		let dbRef = db.ref(`/items/${userID}/${uglySongID}`);
		dbRef.update({
			isFavorited: true
		});
	};

	const removeFromFavorites = function(uglySongID) {
        let userID = getCurrentUser();
		let dbRef = db.ref(`/items/${userID}/${uglySongID}`);
		dbRef.update({
			isFavorited: false
		});
	};

	const removeFromFB = function(uglySongID) {
        let userID = getCurrentUser();
		db.ref(`/items/${userID}/${uglySongID}`).remove();
	};



	return { getCurrentUser, addToFavorites, db, addSongData, getSongData, rateSong, editRating, updateFavorites, addRating, removeFromFB, removeFromFavorites, getVotes, addUpVote, updateUpVote, updateDownVote };
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