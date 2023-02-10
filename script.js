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
  const taskPriority = document.querySelector('input[name="priority"]:checked');
  const taskDueDate = document.getElementById('taskDueDate');
  const taskProject = document.getElementById('taskProject')
  const taskCompleted = document.getElementById('taskCompleted');


  const newTask = createTask(generateId(), taskTitle.value, taskContent.value, taskDueDate.value, taskProject.value, taskPriority.value, taskCompleted.checked);
  console.log(newTask)
  tasksArray.push(newTask);
  saveTasks(tasksArray);
}

function getProjects() {
  const datalist = document.getElementById("projectList");
  datalist.innerHTML='';
  const tasks = getTasks();
  tasks.forEach(task => {
    let option = document.createElement("option");
    option.value = task.project;
    datalist.appendChild(option);
  })

};


activePopup = () => taskPopUp.classList.add('popUpActive');
hidePopup = () => taskPopUp.classList.remove('popUpActive');


const taskPopUp = document.querySelector('.taskPopUp')
const taskForm = document.getElementById('taskForm');
const addButton = document.getElementById('addButton');
const confirmBtn = document.getElementById('confirmBtn')
const cancelBtn = document.getElementById('cancelBtn')
const homeBtn = document.getElementById('home');


homeBtn.onclick = () => showHomeTasks()

addButton.onclick = () => {
  activePopup();
  getProjects();
};

cancelBtn.onclick = () => {
  hidePopup();
  taskForm.reset();
}



confirmBtn.onclick = (e) => {
  addTask();
  taskForm.reset();
  e.preventDefault();
  hidePopup()
}















