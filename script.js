function createTask(id, title, content, dueDate, project, priority, completed) {

    return {
      id,
      title,
      content,
      dueDate,
      project,
      priority,
      completed,
    };
  }

  tasksArray=[];

 

  function generateId() {
    return Math.floor(Math.random() * 9000);
}



//DOM STUFF


function addTask(){

    const taskTitle= document.getElementById('taskTitle');
    const taskContent= document.getElementById('taskContent');
    const taskProject= document.getElementById('taskProject');
    const taskPriority=document.querySelector('input[name="priority"]:checked');
    const taskDueDate= document.getElementById('taskDueDate');
    const taskCompleted= document.getElementById('taskCompleted');
    if (checkInputFields(taskTitle,taskContent,taskDueDate,taskProject,taskPriority,taskCompleted)){
     tasksArray.push(createTask(generateId(),taskTitle.value,taskContent.value,taskDueDate.value,taskProject.value,taskPriority.value,taskCompleted.checked))
        console.log(tasksArray)
    }
        }
        

function checkInputFields(taskTitle,taskContent,taskDueDate,taskProject){
        const taskInputs = [taskTitle,taskContent,taskDueDate,taskProject];
        if (taskInputs.some(input => input.value === "")) {
            alert('Please fill all the fields');
            return false;}
            
        else return true    
        }

function activePopup(){
            const taskPopUp=document.querySelector('.taskPopUp')
            taskPopUp.classList.add('popUpActive')
            }

function hidePopup(){
                const taskPopUp=document.querySelector('.taskPopUp')
                taskPopUp.classList.remove('popUpActive')
                }
 
  
const addButton=document.getElementById('addButton');
const confirmBtn=document.getElementById('confirmBtn')
const cancelBtn=document.getElementById('cancelBtn')

addButton.onclick=()=>activePopup();
cancelBtn.onclick=()=>hidePopup();
confirmBtn.onclick=(e)=>{
    addTask()
  e.preventDefault();
}















// const projectInput =document.getElementById("projectInput")
// projectInput.addEventListener('change',()=>console.log(teste.value))

// const showProjectList = ()=>{
//     const datalist = document.getElementById("projectList");
//     tasksArray.forEach(task => {
//         let option = document.createElement("option");
//         option.value = task.project;
//         datalist.appendChild(option);
        
//     })
// }
// showProjectList()

