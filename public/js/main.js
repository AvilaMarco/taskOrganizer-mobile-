let app = new Vue({
	el: '#app',
	data:
	{
		page: 'tasks',
		pageSection: '',
		isMenu: false,
		arrayMenu: [],
		modalNote: {},
		vueDB: jsDB,
		update: 0,
		userData: null
	},
	methods:
	{
		changePage(event){
			document.querySelectorAll("#nav div").forEach(e => e.classList.remove('active'))
			let btn = event.target
				btn.classList.add('active')
			this.page = btn.id
		},
		inputIsValid(input){
			if (input.value == ''){
				input.classList.add('is-invalid')
				return false
			}else{
				return true
			}
		},
		noModalClearInput(input){
			input.value = ''
			document.querySelector("#closeModal").click()
		},
		addSection(){
			let input = document.getElementById('inputSection')
			if (!this.inputIsValid(input)) return

			let object = {}
			object.name = input.value
			object.items = []

			this.vueDB[this.page].push(object)

			updateDB(this.vueDB,this.userData)
			this.noModalClearInput(input)
		},
		addNote(){
			let input = document.getElementById('inputSection')
			let isCard = document.querySelector('#inputCard').checked
			if (!this.inputIsValid(input)) return

			let object = {}
			object.name = input.value
			object.description = ''
			object.isCard = isCard
			if (isCard){
				object.extras = []
				if (this.addHourNote(object,'hour1')){
					return
				}
				if (this.addHourNote(object,'hour2')) {
					return
				}
			}

			let itemsSection = this.vueDB[this.page].filter( e => e.name == this.pageSection)[0].items
				itemsSection.push(object)
			this.arrayMenu = itemsSection

			updateDB(this.vueDB,this.userData)
			this.noModalClearInput(input)
		},
		updateNoteData(n){
			let notes = this.vueDB[this.page].filter( e => e.name == this.pageSection)[0].items
			let note = notes.filter( e => e.name == this.modalNote.name)[0]
				note.description = document.querySelector(`#modalNote-description${n}`).value
			this.modalNote = note
			this.arrayMenu = notes

			updateDB(this.vueDB,this.userData)
		},
		updateNoteDataCard(prop){
			let notes = this.vueDB[this.page].filter( e => e.name == this.pageSection)[0].items
			let note = notes.filter( e => e.name == this.modalNote.name)[0]

			if (prop == 'newValue') {
				let name = document.querySelector("#nameData").value
				let value = document.querySelector("#valueData").value
				let object = {}
				object.name = name
				object.value = value
				note.extras.push(object)
			}else if(prop == 'hour11'){
				if (this.addHourNote(note,'hour11')){
					return
				}	
			}else if(prop == 'hour22'){
				if (this.addHourNote(note,'hour22')) {
					return
				}
			}

			this.modalNote = note
			this.arrayMenu = notes

			updateDB(this.vueDB,this.userData)
		},
		addHourNote(object,hourName){
			let n;
			if (object.time1 == undefined){
				n = 1
			}else{
				n = 2
			}
			let hours = Array.from(document.querySelectorAll(`input[name=${hourName}]`))
			let props = 0
			if (hours.some( e => e.value != '')){
				hours.forEach( e => {
					if (e.value == ''){
						e.classList.add('is-invalid')
					}else{
						props++
					}
				})
				if (props != 4){
					return true
				}else{
					object['time'+n] = {}
					object['time'+n].day1 = hours[0].value
					object['time'+n].day2 = hours[1].value
					object['time'+n].hour1 = hours[2].value
					object['time'+n].hour2 = hours[3].value
					hours.forEach( e => e.value = '')
				}
			}
		},
		clearModalNote(){
			this.modalNote = {}
		},
		addTask(){
			let input = document.getElementById('inputSection')
			if (!this.inputIsValid(input)) return

			let object = {}
			object.name = input.value
			object.second = []
			object.done = false

			let itemsSection = this.vueDB[this.page].filter( e => e.name == this.pageSection)[0].items
				itemsSection.push(object)
			this.arrayMenu = itemsSection

			updateDB(this.vueDB,this.userData)
			this.noModalClearInput(input)
		},
		addSecondTask(item,index){
			let input = document.querySelector('#its'+index)
			if (!this.inputIsValid(input)) return

			let object = {}
			object.name = input.value
			object.done = false

			let itemsSection = this.vueDB[this.page].filter( e => e.name == this.pageSection)[0].items
				itemsSection.filter( e => e.name == item.name)[0].second.push(object)
			this.arrayMenu = itemsSection

			updateDB(this.vueDB,this.userData)
			input.value = ''
		},
		clearInput(id){
			let input = document.querySelector(`#${id}`)
				input.value = ''
				input.classList.remove('is-invalid')
		},
		swapMenu(element){
			if (element != null){
				this.isMenu = true
				this.pageSection = element.name
				this.arrayMenu = element.items
			}else{
				this.isMenu = false
				this.arrayMenu = []
			}
		},
		toggleActive(element){
			document.querySelector(`#${element}`).classList.toggle('disabled')
		},
		viewDataCard(item){
			this.modalNote = item
		},
		porcentajetasks(item){
			if (item.second.length == 0 || item.second.filter(e => e.done).length == 0){
				if (item.done){
					return 100
				}else{
					return 0
				}
			}else{
				return ((item.second.filter(e => e.done).length * 100) / item.second.length)
			}
		},
		logIn(){
			iniciarSesion()
		},
		logOut(){
			cerrarSesion()
		}
	}
})

function log(some) {
	console.log(some)
}

// enable tooltip
$(document).ready( () => $('[data-toggle="tooltip"]').tooltip() );