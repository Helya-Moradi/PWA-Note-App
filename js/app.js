let $ = document

const inputElem = $.querySelector('#input-field')
const btnSaveElem = $.querySelector('#btn-add')
const btnDeleteElem = $.querySelector('#btn-delete')
const colorsBox = $.querySelectorAll('.color-box')
const notesContainer = $.querySelector('#listed')

let notes=[]

colorsBox.forEach(function (colorBox) {
    colorBox.addEventListener('click', function (event) {
        inputElem.style.backgroundColor = event.target.style.backgroundColor
    })
})

function getData(){
    const getNotes=JSON.parse(localStorage.getItem('notes'))

    if(getNotes){
        notes=getNotes
    }
}

function showData(){
    getData()

    notesContainer.innerHTML=''

    notes.forEach(note=>{
        let newNoteDivElem = $.createElement('div')
        newNoteDivElem.className = 'note'
        newNoteDivElem.style.backgroundColor = note.bgColor
        newNoteDivElem.addEventListener('click', removeNote)

        let newNotePElem = $.createElement('p')
        newNotePElem.className = 'note-text'
        newNotePElem.innerHTML = note.text
        newNotePElem.id=note.id

        newNoteDivElem.append(newNotePElem)
        notesContainer.append(newNoteDivElem)
    })
}

function generateNewNote() {
    const newNote={
        id:(new Date()).getTime(),
        bgColor:inputElem.style.backgroundColor,
        text:inputElem.value,
    }

    notes.push(newNote)

    setData(notes)
    showData()

    inputElem.value = ''

    inputElem.style.backgroundColor = '#fff'
}

function setData(notes){
    localStorage.setItem('notes',JSON.stringify(notes))
}

function removeNote(event) {
    notes=notes.filter(note=>note.id!==Number(event.target.id))

    setData(notes)
    showData()
}

btnDeleteElem.addEventListener('click', function () {
    inputElem.value = ''
    inputElem.style.backgroundColor = '#fff'
})

inputElem.addEventListener('keydown', function (event) {
    if (event.keyCode === 13) {
        if (inputElem.value) {
            generateNewNote()
        }
    }
})

btnSaveElem.addEventListener('click', ()=>{
    if (inputElem.value) {
        generateNewNote()
    }
})

showData()



