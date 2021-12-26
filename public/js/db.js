// actualizo los valores de los datos al salir de la app
window.addEventListener("beforeunload", e => {
	e.preventDefault()
	updateDB(app.vueDB, app.userData)
} );

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
	if (objUser != null && navigator.onLine){
		updateOnlineDB(db,objUser.email)
	}
}	

function updateOfflineDB(db){
	localStorage.setItem('localDB', JSON.stringify(db));
}

function updateVUE(db){
	app.vueDB = db 
}

function updateOnlineDB(localdb,name){
	db.doc("database/"+name).get().then(doc => {
	    if(doc.exists){
	    	// const onlineDB = JSON.parse(JSON.stringify(doc.data()))
	    	// const newDB = mergeDBs(onlineDB,localdb)
	    	// updateOfflineDB(newDB)
	    	// updateVUE(newDB)
	    	updateComplete()
	        // db.doc("database/"+name).set(newDB)
	        db.doc("database/"+name).set(localdb)
	    }else{
	        db.doc("database/"+name).set(localdb)
	    }
	})
}

function mergeDBs(online,offline){
	if (online.notes.length == 0 && online.tasks.length == 0){
		return JSON.parse(JSON.stringify(offline))
	}
	// notes
	offline.notes.forEach(e => {
		if (!online.notes.some(f => f.name == e.name)){
			online.notes = [...online.notes,e]
		}else{
			let compareItem = online.notes.filter(f => f.name == e.name)[0]
			e.items.forEach(f => {
				if (!compareItem.items.some(g => g.name == f.name)) {
					compareItem.items = [...compareItem.items,f]
				}else{
					let compareItem2 = compareItem.items.filter(g => g.name == f.name)[0]
					if (!f.isCard){
						if (f.description != compareItem2.description && f.description != '') {
							compareItem2.description = f.description
						}
					}else{
						// comprobar propiedas de una nota que es tarjeta y tiene mas datos
					}
				}
			})
		}
	})
	// tasks
	offline.tasks.forEach(e => {
		if (!online.tasks.some(f => f.name == e.name)){
			online.tasks = [...online.tasks,e]
		}else{
			let compareItem = online.tasks.filter(f => f.name == e.name)[0]
			e.items.forEach(f => {
				if (!compareItem.items.some(g => g.name == f.name)) {
					compareItem.items = [...compareItem.items,f]
				}else{
					let compareItem2 = compareItem.items.filter(g => g.name == f.name)[0]
					if (compareItem2.done != f.done && f.done) compareItem2.done = f.done
					f.second.forEach(g => {
						if (!compareItem2.second.some(h => h.name == g.name)){
							compareItem2.second = [...compareItem2.second,g]
						}else{
							let compareItem3 = compareItem2.second.filter(h => h.name == g.name)[0]
							if (compareItem3.done != g.done && g.done) compareItem3.done = g.done
						}
					})

				}
			})
		}
	})

	return JSON.parse(JSON.stringify(online))
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

function updateComplete(){
	let alert = document.querySelector("#alertdb")
		alert.classList.replace("d-none","apper")
		setTimeout(() =>{
			alert.classList.remove("apper")
		},1000)
		setTimeout(() =>{
			alert.classList.add("disappear")
		},2000)
		setTimeout(() =>{
			alert.classList.remove("apper","disappear")
			alert.classList.add("d-none")
		},3000)
}