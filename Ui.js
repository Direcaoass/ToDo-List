import { createTask, generateId, saveTasks, getTasks, removeTask, updateTask, } from './script.js'

import {isThisWeek,isToday,parseISO } from './node_modules/date-fns/esm/index.js';



(function startUI() {
  getTasksToShow('All the tasks');
  getProjects()
  btnEvents()

})()

function getTasksToShow(menuTitle) {
  const tasks = getTasks();
  const now = new Date(); 

  if (menuTitle === 'Today tasks') {
    const todayTasks = tasks.filter(task => isToday(parseISO(task.dueDate)));
    showTasks(todayTasks, menuTitle);
  }   
 
  else if (menuTitle === 'This Week tasks') {
    const weekTasks = tasks.filter(task => isThisWeek(parseISO(task.dueDate), { weekStartsOn: 1 }));
    showTasks(weekTasks, menuTitle);
  } 

  else if (menuTitle === 'All the tasks') {
    showTasks(tasks, menuTitle);
  }   
  
  else {
    const projectTasks = tasks.filter(task => task.project === menuTitle)
    showTasks(projectTasks, menuTitle);
  }
}





function showTasks(tasksToShow, menuTitle) {
  const mainContent = document.querySelector('.mainContent')
  let taskContainer = document.createElement('div');
  taskContainer.className = "taskContainer";

  const tasks = tasksToShow;
  tasks.forEach(task => {
    const taskDiv = document.createElement('div');
    taskDiv.className = "taskDiv";
    taskDiv.innerHTML = `
        <div class="leftSide">
          <input type="checkbox" id="taskCheck" ${task.completed ? 'checked' : ''}>
          <div class="title">${task.title}</div>
        </div>
        <div class="rightSide">
          <div class="dueDate">${task.dueDate}</div>
          <button class="edit">Edit</button>
          <button class="remove">Remove</button>
        </div>
      `;
    const taskTitleElem = taskDiv.querySelector('.title')
    const taskDateElem = taskDiv.querySelector('.dueDate')
    if (task.completed) {
      taskTitleElem.classList.add('checkedTasks');
      taskDateElem.classList.add('checkedTasks');
    }

    taskContainer.appendChild(taskDiv);
    taskEvents(task.id, taskContainer, taskDiv, taskTitleElem, taskDateElem);
  })

  mainContent.innerHTML = `<h3 id="menuTitle">${menuTitle}</h3>`;
  mainContent.appendChild(taskContainer);
}

function taskEvents(taskId, taskContainer, taskElement, taskTitleElem, taskDateElem) {
  taskElement.querySelector('.edit').addEventListener('click', () => {
    editTask(taskId);
  });
  taskElement.querySelector('.remove').addEventListener('click', () => {
    removeTask(taskId, taskContainer, taskElement)
  });
  taskElement.querySelector('#taskCheck').addEventListener('change', () => {
    toggleCheckTask(taskId, taskTitleElem, taskDateElem)
  });
}

function toggleCheckTask(id, taskTitleElem, taskDateElem) {
  const tasks = getTasks();
  const taskTarget = tasks.find((task) => task.id === id);
  taskTarget.completed = !taskTarget.completed;
  saveTasks(tasks);
  taskTitleElem.classList.toggle('checkedTasks');
  taskDateElem.classList.toggle('checkedTasks');

}

function editTask(id) {
  let editFlag = true;
  getProjects();
  getTaskToEdit(id)
  btnEvents(id, editFlag)
  popupToggle(true);
}

function getTaskToEdit(id) {
  setPopupTitle("Edit task")

  const taskTarget = getTasks().find((task) => task.id === id);
  const taskTitle = document.querySelector('#taskTitle');
  const taskContent = document.querySelector('#taskContent');
  const taskDueDate = document.querySelector('#taskDueDate');
  const taskPriority = document.querySelector(`input[name='priority'][value='${taskTarget.priority}']`);
  const taskProject = document.querySelector('#taskProject')

  taskTitle.value = taskTarget.title;
  taskContent.value = taskTarget.content;
  taskPriority.checked = true;
  taskDueDate.value = taskTarget.dueDate;
  taskProject.value = taskTarget.project;

}

function addTask(id, editFlag) {
  const tasks = getTasks();

  const taskTitle = document.getElementById('taskTitle');
  const taskContent = document.getElementById('taskContent');
  const taskPriority = document.querySelector('input[name="priority"]:checked');
  const taskDueDate = document.getElementById('taskDueDate');
  const taskProject = document.getElementById('taskProject')


  if (checkInputFields(taskTitle, taskContent, taskDueDate, taskProject, taskPriority)) {

    if (!editFlag) {
      const newTask = createTask(generateId(), taskTitle.value, taskContent.value, taskDueDate.value, taskProject.value, taskPriority.value);
      tasks.push(newTask);
    }
    else {
      updateTask(tasks, id, taskTitle.value, taskContent.value, taskDueDate.value, taskProject.value, taskPriority.value)
    }
    saveTasks(tasks);
    popupToggle(false)
    formReset();
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

export function getProjects() {
  const datalist = document.getElementById("projectList");
  datalist.textContent = '';
  const tasks = getTasks();
  const uniqueProjects = new Set();
  tasks.forEach(task => uniqueProjects.add(task.project));
  uniqueProjects.forEach(project => {
    let option = document.createElement("option");
    option.value = project;
    datalist.appendChild(option);
  });
  updateProjectsMenu(uniqueProjects)
}

function updateProjectsMenu(uniqueProjects) {

  const projectsDiv = document.getElementById('projectsDiv');
  projectsDiv.textContent = '';

  uniqueProjects.forEach(project => {
    const projectItem = document.createElement('div');
    projectItem.textContent = project;
    projectItem.onclick = () => getTasksToShow(projectItem.innerText);
    projectsDiv.appendChild(projectItem)
  })

}

function formReset() {
  const taskForm = document.getElementById('taskForm');
  taskForm.reset();
}


function setPopupTitle(title) {
  const popupTitle = document.querySelector('#popupTitle');
  popupTitle.innerText = title;
}

function popupToggle(action) {
  const taskPopUp = document.querySelector('.taskPopUp')
  taskPopUp.classList.toggle('popUpActive', action);
}



function btnEvents(id, editFlag) {

  const homeBtn = document.getElementById('home');
  const todayBtn = document.getElementById('today');
  const weekBtn = document.getElementById('week');
  const projectBtn = document.getElementById('projectBtn');
  const addButton = document.getElementById('addButton');
  const confirmBtn = document.getElementById('confirmBtn')
  const cancelBtn = document.getElementById('cancelBtn')

  homeBtn.onclick = () => getTasksToShow('All the tasks');
  projectBtn.onclick = () => getTasksToShow('All the tasks');
  todayBtn.onclick = () => getTasksToShow('Today tasks');
  weekBtn.onclick = () => getTasksToShow('This Week tasks');

  addButton.onclick = () => {
    editFlag = false;
    setPopupTitle("Add task")
    formReset();
    popupToggle(true);
    getProjects();
  };


  confirmBtn.onclick = (e) => {
    addTask(id, editFlag);
    const titleTasks = document.getElementById('menuTitle')
    getTasksToShow(`${titleTasks.innerText}`)
    getProjects()
    e.preventDefault();
  }

  cancelBtn.onclick = () => {
    editFlag = false;
    popupToggle(false);


  }
}

