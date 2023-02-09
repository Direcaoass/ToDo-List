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

tasksArray = [];


function generateId() {
  return Math.floor(Math.random() * 9000);
}

//Local Storage

function saveTasks(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function getTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks') || '[]')
  return tasks;
}


//DOM STUFF

function showHomeTasks() {
  const mainContent = document.querySelector('.mainContent')
  const tasks = getTasks();
  let taskDiv = '';
  tasks.forEach(task => {

    taskDiv += `
       <div class="taskDiv">
    <div class="leftSide">
      <input type="checkbox" id="taskCheck">
      <div class="title">${task.title}</div>
    </div>
    <div class="rightSide">
      <div class="dueDate">${task.dueDate}</div>
      <button class="edit">Edit</button>
      <button class="remove">Remove</button>
    </div>
  </div>` ;

    mainContent.innerHTML = `<h3>Filter name</h3>` + taskDiv;
  })
}



function addTask() {

  const taskTitle = document.getElementById('taskTitle');
  const taskContent = document.getElementById('taskContent');
  const taskProject = document.getElementById('taskProject');
  const taskPriority = document.querySelector('input[name="priority"]:checked');
  const taskDueDate = document.getElementById('taskDueDate');
  const taskCompleted = document.getElementById('taskCompleted');

  if (checkInputFields(taskTitle, taskContent, taskDueDate, taskProject, taskPriority, taskCompleted)) {

    const newTask = createTask(generateId(), taskTitle.value, taskContent.value, taskDueDate.value, taskProject.value, taskPriority.value, taskCompleted.checked);
    console.log(newTask)
    tasksArray.push(newTask);
    saveTasks(tasksArray);

  }
}


function checkInputFields(taskTitle, taskContent, taskDueDate, taskProject) {
  const taskInputs = [taskTitle, taskContent, taskDueDate, taskProject];
  if (taskInputs.some(input => input.value === "")) {
    alert('Please fill all the fields');
    return false;
  }

  else return true
}

activePopup = () => taskPopUp.classList.add('popUpActive');

hidePopup = () => taskPopUp.classList.remove('popUpActive');


function clearPopup() {
  const inputs = taskPopUp.querySelectorAll('input,textarea');
  inputs.forEach(input => {
    input.value = "";
    if (input.type === "radio" || input.type === "checkbox") {
      input.checked = false;
    }
  })

}


const taskPopUp = document.querySelector('.taskPopUp')



const addButton = document.getElementById('addButton');
const confirmBtn = document.getElementById('confirmBtn')
const cancelBtn = document.getElementById('cancelBtn')
const homeBtn = document.getElementById('home');


homeBtn.onclick = () => showHomeTasks()

addButton.onclick = () => {
  activePopup();
};

cancelBtn.onclick = () => {
  hidePopup();
  clearPopup();
}

confirmBtn.onclick = (e) => {
  addTask();
  clearPopup();
  e.preventDefault();
  hidePopup()
}















