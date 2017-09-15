"use strict";

app.factory("userFactory", function($q, $rootScope, FBCreds) {

    var provider = new firebase.auth.GoogleAuthProvider(),
		currentUser = null;
	
    /* listens for a change in Firebase's auth state (logged in or out) */
	const isAuthenticated = function (){
        return new Promise ((resolve, reject) => {
            firebase.auth().onAuthStateChanged(user => {
                if (user){
                    currentUser = user.uid;
                    resolve(true);
                }else {
                    reject(false);
                }
            });
        });
    };

    const loginGoogle = function () {
		/* returns a promise. Use .then() */
		return firebase.auth().signInWithPopup(provider);
	};

    const logOut = function(){
		// $('#my-movies').hide();
		return firebase.auth().signOut();
	};

	const getUser = function(){
		return currentUser;
	};

	return { loginGoogle, logOut, getUser};
});





