let app = new Vue({
	el: '#app',
	data:
	{
		page: 'tasks',
		pageSection: '',
		isMenu: false,
		arrayMenu: [],
		taskSection: ['job','youtube','task','homework','lol','clash','computacion','music','games'],
		notesSection: ['services','programation'],
		objectSections:{}
	},
	methods:
	{
		changePage(event){
			document.querySelectorAll("#nav div").forEach(e => e.classList.remove('active'))
			let btn = event.target
				btn.classList.add('active')
			this.page = btn.id
		},
		addSection(){
			// definition dates
			let input = document.getElementById('inputSection')
			if (input.value == ''){
				input.classList.add('is-invalid')
				return
			}
			// add section
			if (this.page == 'tasks'){
				this.taskSection.push(input.value)
			}else if(this.page == 'notes'){
				this.notesSection.push(input.value)
			}
			input.value = ''
			document.querySelector("#closeModal").click()
		},
		addNote(){
			log("notes")
			let input = document.getElementById('inputSection')
			let isCard = document.querySelector('#inputCard').value
			let object = {}
			if (input.value == ''){
				input.classList.add('is-invalid')
				return
			}
			if (this.objectSections[this.pageSection] == undefined){
				this.objectSections[this.pageSection] = []
			}
			object.name = input.value
			object.isCard = isCard
			if (isCard){
				let hours1 = Array.from(document.querySelectorAll('input[name=hour1]'))
				let props1 = 0
				let hours2 = Array.from(document.querySelectorAll('input[name=hour2]'))
				let props2 = 0
				if (hours1.some( e => e.value != '')){
					hours1.forEach( e => {
						if (e.value == ''){
							e.classList.add('is-invalid')
						}else{
							props1++
						}
					})
					if (props1 != 4){
						return
					}else{
						object.time1 = {}
						object.time1.day1 = hours1[0].value
						object.time1.day2 = hours1[1].value
						object.time1.hour1 = hours1[2].value
						object.time1.hour2 = hours1[3].value
						hours1.forEach( e => e.value = '')
					}
				}
				if (hours2.some( e => e.value != '')){
					hours2.forEach( e => {
						if (e.value == ''){
							e.classList.add('is-invalid')
						}else{
							props2++
						}
					})
					if (props2 != 4){
						return
					}else{
						object.time2 = {}
						object.time2.day1 = hours1[0].value
						object.time2.day2 = hours1[1].value
						object.time2.hour1 = hours1[2].value
						object.time2.hour2 = hours1[3].value
						hours2.forEach( e => e.value = '')
					}
				}
			}
			this.objectSections[this.pageSection].push(object)
			this.arrayMenu = this.objectSections[this.pageSection]
			// reset
			input.value = ''
			document.querySelector("#closeModal").click()
			// document.querySelector("#isCardActive").click()
		},
		addTask(){
			log("tasks")
			let input = document.getElementById('inputSection')
			let object = {}
			if (input.value == ''){
				input.classList.add('is-invalid')
				return
			}
			if (this.objectSections[this.pageSection] == undefined){
				this.objectSections[this.pageSection] = []
			}
			object.main = input.value
			object.second = []
			this.objectSections[this.pageSection].push(object)
			this.arrayMenu = this.objectSections[this.pageSection]
		},
		swapMenu(element){
			if (element != null){
				this.isMenu = true
				this.pageSection = element
				this.arrayMenu = this.objectSections[this.pageSection]
			}else{
				this.isMenu = false
				this.arrayMenu = []
			}
		},
		toggleActive(element){
			document.querySelector(`#${element}`).classList.toggle('disabled')
		},
		viewDataCard(item){
			if (!item.isCard) return
			log(item)
		}
	}
})

function log(some) {
	console.log(some)
}

// enable tooltip
$(document).ready( () => $('[data-toggle="tooltip"]').tooltip() );