import _ from 'lodash';
import json8 from 'json8-patch';
import { updateDB } from './firebase'
import { vueConfig, logoComponentConfig } from './vueConfig'
import { addSliders } from './animation'

let application;
// actualizo los valores de los datos al salir de la app
window.addEventListener("beforeunload", e => {
	e.preventDefault()
	updateDB(application.vueDB, application.userData)
} );

//evente que resiva si un usuario inicio sesion
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    crearUserVue(user)
    updateDB(application.vueDB,application.userData)
    crearUser(application.userData)
  } else {
    application.userData = null
  }
});

// defino la base de datos sino existe
if (JSON.parse(localStorage.getItem('localDB')) == undefined){
	localStorage.setItem('localDB', JSON.stringify({ tasks: [], notes: [] }));
}

Vue.component('logos-slider', logoComponentConfig)
console.log(logoComponentConfig);
application = vueConfig()
console.log(application);

// enable tooltip
$(document).ready( () => $('[data-toggle="tooltip"]').tooltip() );

addSliders()