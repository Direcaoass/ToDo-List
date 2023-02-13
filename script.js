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
let editFlag = false;


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
  let taskContainer = document.createElement('div');
  taskContainer.className = "taskContainer";
  tasks.forEach(task => {

    const taskDiv = document.createElement('div');
    taskDiv.className = "taskDiv";
    taskDiv.innerHTML = `
      <div class="leftSide">
        <input type="checkbox" id="taskCheck">
        <div class="title">${task.title}</div>
      </div>
      <div class="rightSide">
        <div class="dueDate">${task.dueDate}</div>
        <button class="edit">Edit</button>
        <button class="remove">Remove</button>
      </div>
    `;
    taskContainer.appendChild(taskDiv);
    taskEvents(task.id, taskContainer, taskDiv);
  })

  mainContent.innerHTML = `<h3>Menu name</h3>`;
  mainContent.appendChild(taskContainer);
}

function taskEvents(taskId, taskContainer, taskElement) {
  console.log(taskId)
  taskElement.querySelector('.edit').addEventListener('click', () => {
    editTask(taskId);
  });
  taskElement.querySelector('.remove').addEventListener('click', () => {
    removeTask(taskId, taskContainer, taskElement)
  });

}

function editTask(id) {
  console.log(id)
  getProjects();
  editFlag = true;
  getTaskToEdit(id)
  popUpEvents(id)
  activePopup();
}

function getTaskToEdit(id) {
  setPopupTitle("Edit task")
  setProjectPlaceHolder('');

  const taskTarget = getTasks().find((task) => task.id === id);

  const taskTitle = document.querySelector('#taskTitle');
  const taskContent = document.querySelector('#taskContent');
  const taskDueDate = document.querySelector('#taskDueDate');
  const taskCompleted = document.querySelector('#taskCompleted');
  const taskPriority = document.querySelector(`input[name='priority'][value='${taskTarget.priority}']`);


  taskTitle.value = taskTarget.title;
  taskContent.value = taskTarget.content;
  taskPriority.checked = true;
  taskDueDate.value = taskTarget.dueDate;
  setProjectPlaceHolder(taskTarget.project);
  taskCompleted.checked = taskTarget.completed;
}



function removeTask(id, taskContainer, taskElement) {
  const tasks = getTasks().filter((task) => task.id !== id);
  saveTasks(tasks);
  taskContainer.removeChild(taskElement);
}


function addTask(id) {
  const taskTitle = document.getElementById('taskTitle');
  const taskContent = document.getElementById('taskContent');
  const taskPriority = document.querySelector('input[name="priority"]:checked');
  const taskDueDate = document.getElementById('taskDueDate');
  const taskProject = document.getElementById('taskProject')
  const taskCompleted = document.getElementById('taskCompleted');



  if (checkInputFields(taskTitle, taskContent, taskDueDate, taskProject, taskPriority, taskCompleted)) {

    if (!editFlag) {
      const newTask = createTask(generateId(), taskTitle.value, taskContent.value, taskDueDate.value, taskProject.value, taskPriority.value, taskCompleted.checked);
      console.log(newTask)
      tasksArray.push(newTask);
    }
    else {
      updateTask(id, taskTitle.value, taskContent.value, taskDueDate.value, taskProject.value, taskPriority.value, taskCompleted.checked)

    }
    saveTasks(tasksArray);
    hidePopup()
    formReset();
  }
}

function updateTask(id, taskTitle, taskContent, taskDueDate, taskProject, taskPriority, taskCompleted) {
  const task = tasksArray.find(task => task.id === id);
  if (task) {
    task.title = taskTitle;
    task.content = taskContent;
    task.priority = taskPriority;
    task.dueDate = taskDueDate;
    task.project = taskProject;
    task.completed = taskCompleted;

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

function getProjects() {
  const datalist = document.getElementById("projectList");
  datalist.innerHTML = '';
  const tasks = getTasks();
  const uniqueProjects = new Set();
  tasks.forEach(task => uniqueProjects.add(task.project));
  uniqueProjects.forEach(project => {
    let option = document.createElement("option");
    option.value = project;
    datalist.appendChild(option);
  });
}

function setProjectPlaceHolder(text) {
  const taskProject = document.querySelector('#taskProject')
  taskProject.setAttribute('placeholder', text)
}


function setPopupTitle(title) {
  const popupTitle = document.querySelector('#popupTitle');
  popupTitle.innerText = title;
}


const taskPopUp = document.querySelector('.taskPopUp')
const taskForm = document.getElementById('taskForm');
const addButton = document.getElementById('addButton');
const confirmBtn = document.getElementById('confirmBtn')
const cancelBtn = document.getElementById('cancelBtn')
const homeBtn = document.getElementById('home');

activePopup = () => taskPopUp.classList.add('popUpActive');
hidePopup = () => taskPopUp.classList.remove('popUpActive');
formReset = () => taskForm.reset();

homeBtn.onclick = () => showHomeTasks()

addButton.onclick = () => {
  setPopupTitle("Add task")
  setProjectPlaceHolder('Project Name');
  activePopup();
  getProjects();

};

cancelBtn.onclick = () => {
  hidePopup();
  formReset();
  editFlag = false;
}

function popUpEvents(id) {
  confirmBtn.onclick = (e) => {
    addTask(id);
    editFlag = false;
    e.preventDefault();
  }

}

popUpEvents()


















