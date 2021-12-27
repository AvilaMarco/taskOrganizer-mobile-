/* Animations */
let posInit_x = 0;
let posNow_x = 0
let editValue = false
let deleteValue = false

const addSliders = () => {
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

export {addSliders};