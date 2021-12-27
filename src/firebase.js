let store = firebase.firestore();

const updateDB = (email, db) => {
  updateOfflineDB(db);
  if (email != null && navigator.onLine) {
    updateOnlineDB(email, db);
  }
};

const updateOfflineDB = (db) => {
  localStorage.setItem("localDB", JSON.stringify(db));
};

const updateOnlineDB = (email, db) => {
  const docPath = `database/${email}`;

  store.doc(docPath)
    .get()
    .then(({exists}) => {
      if (exists) updateComplete();

      store.doc(docPath).set(db);
    });
};


/* User */
const crearUser = (user) => {
    const docPath = `users/${user.email}`

    store.doc(docPath).get()
        .then((doc) => {
            if (doc.exists) {
                console.log("user ready");
            } else {
                store.doc(docPath)
                .set(user)
                .then(function (docRef) {
                    console.log("usuario enviado correctamente");
                });
            }
        });
};

const login = () => {
    let providerGoogle = new firebase.auth.GoogleAuthProvider();
  firebase
    .auth()
    .signInWithPopup(providerGoogle)
    .then(function (user) {
        loadUser(user);
        updateDB(app.vueDB, app.userData);
        crearUser(app.userData);
    })
    .catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
    });
};

const logout = () => {
  firebase.auth().signOut();
};

const loadUser = (app, user) => {
  app.userData = {};
  app.userData.photoURL = user.photoURL;
  app.userData.displayName = user.displayName;
  app.userData.email = user.email;
  app.userData.database = {};
};

const updateComplete = () => {
  let alert = document.querySelector("#alertdb");
  alert.classList.replace("d-none", "apper");
  setTimeout(() => {
    alert.classList.remove("apper");
  }, 1000);
  setTimeout(() => {
    alert.classList.add("disappear");
  }, 2000);
  setTimeout(() => {
    alert.classList.remove("apper", "disappear");
    alert.classList.add("d-none");
  }, 3000);
};

export {updateDB, login, logout};
