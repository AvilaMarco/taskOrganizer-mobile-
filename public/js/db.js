// actualizo los valores de los datos al salir de la app
window.addEventListener("beforeunload", () => updateDB(app.vueDB, app.userData) );

//evente que resiva si un usuario inicio sesion
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    crearUserVue(user)
    updateDB(app.vueDB,app.userData)
    crearUser(app.userData)
  } else {
    app.userData = null
  }
});

// defino la base de datos sino existe
if (JSON.parse(localStorage.getItem('localDB')) == undefined){
	localStorage.setItem('localDB', JSON.stringify({ tasks: [], notes: [] }));
}

let db = firebase.firestore();
let providerGoogle = new firebase.auth.GoogleAuthProvider();
let jsDB = JSON.parse(localStorage.getItem('localDB'))

function updateDB(db,objUser){
	updateOfflineDB(db)
	if (objUser != null){
		updateOnlineDB(db,objUser.email)
	}
}	

function updateOfflineDB(db){
	localStorage.setItem('localDB', JSON.stringify(db));
}

function updateOnlineDB(name){
	db.doc("database/"+name).get().then(function(doc) {
	    if (doc.exists) {
	    	console.log("Document data:", doc.data());
	        db.doc("database/"+name).set(db, { merge: true }).then(()=>{
	        	db.doc("database/"+name).get().then(function(doc) {
	        		console.log("Document data:", doc.data());
	        	})
	        })
	    } else {
	        db.doc("database/"+name).set(db)
	    }
	})
}

function crearUser(objUser){
	db.doc("users/"+objUser.email).get().then( doc => {
		if (doc.exists) {
			console.log("user ready")
		}else{
			db.doc("users/"+objUser.email).set(objUser).then(function(docRef) {
			    console.log("usuario enviado correctamente");
			})
		}
	})
}

function iniciarSesion(){
	firebase.auth().signInWithPopup(providerGoogle)
	.then(function(user){
  		crearUserVue(user)
  		updateDB(app.vueDB,app.userData)
    	crearUser(app.userData)
	})
	.catch(function(error) {
	  // Handle Errors here.
	  var errorCode = error.code;
	  var errorMessage = error.message;
	  // The email of the user's account used.
	  var email = error.email;
	  // The firebase.auth.AuthCredential type that was used.
	  var credential = error.credential;
	  // ...
	});
}

function cerrarSesion(){
	firebase.auth().signOut()
}

function crearUserVue(user){
	app.userData = {}
	app.userData.photoURL = user.photoURL
	app.userData.displayName = user.displayName
	app.userData.email = user.email
	app.userData.database = {}
}