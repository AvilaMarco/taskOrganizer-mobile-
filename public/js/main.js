Vue.component('logos-slider', {
	template:`
		<div class="p-absolute d-flex w-100 justify-content-between align-item-center pl-2 pr-2">
			<div><img :id="'edit'+dataid.name.replace(/ /g, '')" @click="editData(dataid)" src="img/edit.png" class="logo logo-activar logo-yellow logo-desactivar">Edit</div>
			<div>Delete<img :id="'delete'+dataid.name.replace(/ /g, '')" @click="deleteData(dataid)" src="img/delete.png" class="logo logo-activar logo-desactivar"></div>
		</div>`,
		props:{dataid: Object},
		methods:{
			editData(item){
				this.$emit('event-edit', this.dataid)
			},
			deleteData(item){
				this.$emit('event-delete', this.dataid)
			}
		}
})

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
		loadComplete: false,
		userData: null
	},
	updated: function () {
		this.$nextTick(function () {
			addSliders()
		  })
	},
	mounted: function (){
		this.$nextTick(function (){
			this.loadComplete = true
		})
	},
	methods:
	{
		changePage(event){
			document.querySelectorAll("#nav div").forEach(e => e.classList.remove('active'))
			let btn = event.target
				btn.classList.add('active')
			this.page = btn.id
		},
		inputIsValid(input,exists){
			if (input.value == '' || exists != -1){
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
			let exists = this.vueDB[this.page].findIndex(e => e.name == input.value)
			if (!this.inputIsValid(input , exists)) return

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
			let itemsSection = this.vueDB[this.page].filter( e => e.name == this.pageSection)[0].items
			let exists = itemsSection.findIndex(e => e.name == input.value)
			if (!this.inputIsValid(input,exists)) return

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
			let itemsSection = this.vueDB[this.page].filter( e => e.name == this.pageSection)[0].items
			let exists = itemsSection.findIndex(e => e.name == input.value)
			if (!this.inputIsValid(input,exists)) return

			let object = {}
			object.name = input.value
			object.second = []
			object.done = false

			itemsSection.push(object)
			this.arrayMenu = itemsSection

			updateDB(this.vueDB,this.userData)
			this.noModalClearInput(input)
		},
		addSecondTask(item,index){
			let input = document.querySelector('#its'+index)
			let itemsSection = this.vueDB[this.page].filter( e => e.name == this.pageSection)[0].items
			let itemsSectionB = itemsSection.filter( e => e.name == item.name)[0].second
			let exists = itemsSectionB.findIndex(e => e.name == input.value)
			if (!this.inputIsValid(input, exists)) return

			let object = {}
			object.name = input.value
			object.done = false

			itemsSectionB.push(object)
			this.arrayMenu = itemsSection
			item.done = item.second.every(e => e.done)

			updateDB(this.vueDB,this.userData)
			input.value = ''
			input.focus()
		},
		linkTasks(task,subtask){
			if (subtask != null){
				subtask.done = !subtask.done
				task.done = task.second.every(e => e.done)
			}else{
				task.done = !task.done
				task.second.forEach(e => e.done = task.done)
			}
		},
		editData(item){
			let newdata = prompt(`Do you want to modify the information? \n Enter the new value`,`${item.name}`)
			if (!newdata) return
			item.name = newdata
			updateDB(this.vueDB,this.userData)
		},
		deleteData(item){
			let borrar = confirm("are you sure?")
			if(!borrar) return
			if(this.isMenu){
				let newSection = this.vueDB[this.page].filter( e => e.name == this.pageSection)[0].items
				if(item.second == undefined){
					newSection.filter(e => e.second.filter(e => e.name == item.name).length != 0)[0].second
							  .splice((newSection.findIndex(e => e.name == item.name)),1)
				}else{
					newSection.splice((newSection.findIndex(e => e.name == item.name)),1)
				}
			}else{
				let newSection = this.vueDB[this.page]
				newSection.splice((newSection.findIndex(e => e.name == item.name)),1)
			}
			updateDB(this.vueDB,this.userData)
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
		porcentajetasks(subtask,isdone){
			if (subtask.length == 0 || subtask.filter(e => e.done).length == 0){
				if (isdone){
					return 100
				}else{
					return 0
				}
			}else{
				return ((subtask.filter(e => e.done).length * 100) / subtask.length)
			}
		},
		logIn(){
			iniciarSesion()
		},
		logOut(){
			cerrarSesion()
		},
		updateDataBase(){
			updateDB(this.vueDB,this.userData)
		}
	}
})

function asd(some) {
	console.log(some)
}

// enable tooltip
$(document).ready( () => $('[data-toggle="tooltip"]').tooltip() );

addSliders()

let posInit_x = 0;
let posNow_x = 0
let editValue = false
let deleteValue = false

function addSliders(){
	for(slider of document.querySelectorAll(".slider")){
		slider.addEventListener('touchstart',startMov)
		slider.addEventListener('touchmove',moving)
		slider.addEventListener('touchend',endMov)
		slider.addEventListener('transitionend', event => event.target.classList.remove('transition'))
	}
}

function resetPos(){
	posInit_x = 0;
	posNow_x = 0
	editValue = false
	deleteValue = false
}

function startMov(event){
	if (!event.target.classList.contains('slider')) return
	posInit_x = event.changedTouches[0].screenX
}

function endMov({target}){
	if (!target.classList.contains('slider') || Math.abs(posInit_x - posNow_x) < 5) return
	target.style.left = "0px"
	target.classList.add("transition")
	if (editValue){
		document.querySelector(`#edit${target.dataset.id.replace(/ /g, '')}`).click()
	}else if(deleteValue){
		document.querySelector(`#delete${target.dataset.id.replace(/ /g, '')}`).click()
	}
	resetPos()
}

function moving(event){
	let slider = event.target
	if (!slider.classList.contains('slider')) return
	let target = event.target.nextElementSibling
	let imgEdit = target.firstElementChild.firstElementChild
	let imgDelete = target.lastElementChild.firstElementChild
	posNow_x = event.changedTouches[0].screenX
	let posValue = posInit_x < 520 ? posNow_x - posInit_x : -(posInit_x - posNow_x)
	let max = 110
	let min = -110
	let maxON = 70
	let minON = -90

	if (posValue > max) slider.style.left = `${max}px`
	else if(posValue < min) slider.style.left = `${min}px`
	else slider.style.left = `${posValue}px`
		
	if (posValue > maxON){
		imgEdit.classList.remove("logo-desactivar")
		editValue = true
	}else if(posValue < minON){
		imgDelete.classList.remove("logo-desactivar")
		deleteValue = true
	}else{
		imgEdit.classList.add("logo-desactivar")
		imgDelete.classList.add("logo-desactivar")
		deleteValue = false
		editValue = false
	}
}