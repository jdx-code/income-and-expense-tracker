// Selects all delete buttons
const deleteBtn = document.querySelectorAll('.deleteBtn')

// loops through all the buttons in deleteBtn array and finds the button that has been clicked
Array.from(deleteBtn).forEach(btn => {
    btn.addEventListener('click', deleteCourse)
})

// function to be called when a particular delete button is clicked
async function deleteCourse() {
    
    // grab the text binding the delete button that user clicks
    const courseName = this.parentNode.parentNode.childNodes[1].childNodes[1].innerText;

    try{
        const res = await fetch('../delete-course', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'courseToBeDeleted': courseName
            })                      
        })    
        if(res){
            alert('Course deleted..')
        }         
        location.reload()
    } catch (err) {
        console.error(err)        
    }    
}

// Selects all delete buttons
const toggleImgBtn = document.querySelectorAll('.toggleImgBtn')

// loops through all the buttons in deleteBtn array and finds the button that has been clicked
Array.from(toggleImgBtn).forEach(btn => {
    btn.addEventListener('click', toggleImgView)
})

function toggleImgView() {

    const student = this.parentNode.nextSibling.parentNode.lastElementChild    
    
    if (student.style.display !== 'block') {
        student.style.display = 'block'                
        this.innerHTML = 'Hide Preview'
        
    } else {
        student.style.display = 'none'          
        this.innerHTML = 'Show Preview'              
    }    
      
    console.log(student)
}