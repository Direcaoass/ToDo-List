function createTask(id, title, content, dueDate, project, priority, completed) {

  return {
    id, title, content, dueDate, project, priority, completed,
  };
}

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

function getTasksToShow(menuTitle) {
  const tasks = getTasks();

  if (menuTitle === 'Today tasks') {
    const todayTasks = tasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      const today = new Date(Date.UTC(dueDate.getUTCFullYear(), dueDate.getUTCMonth(), dueDate.getUTCDate()));
      const now = new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate()));
      return today.toString() === now.toString();
    });
    showTasks(todayTasks, menuTitle);

  } else if (menuTitle === 'This Week tasks') {
    const weekTasks = tasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      const startOfWeek = new Date(Date.UTC(dueDate.getUTCFullYear(), dueDate.getUTCMonth(), dueDate.getUTCDate() - dueDate.getUTCDay()));
      const endOfWeek = new Date(Date.UTC(startOfWeek.getUTCFullYear(), startOfWeek.getUTCMonth(), startOfWeek.getUTCDate() + 6));
      const now = new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate()));
      return now >= startOfWeek && now <= endOfWeek;
    });
    showTasks(weekTasks, menuTitle)
  }
  else if (menuTitle === 'All the tasks') {
    showTasks(tasks, menuTitle);
  }

  else {
    const projectTasks = tasks.filter(task => task.project === menuTitle)
    console.log(projectTasks)
    showTasks(projectTasks, `${menuTitle} tasks`);
  }


}







// import { isToday, isThisWeek } from './node_modules/date-fns';
// function getTasksToShow(menuTitle) {
//   const tasks = getTasks();



//   if (menuTitle === 'Today tasks') {
//     const todayTasks = tasks.filter(task => {
//       const dueDate = new Date(task.dueDate);
//       return isToday(dueDate);
//     });

//     showTasks(todayTasks, menuTitle);
//   } else if (menuTitle === 'This Week tasks') {
//     const weekTasks = tasks.filter(task => {
//       const dueDate = new Date(task.dueDate);
//       return isThisWeek(dueDate);
//     });

//     showTasks(weekTasks, menuTitle);
//   } else {
//     showTasks(tasks, menuTitle);
//   }
// }



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
    taskContainer.appendChild(taskDiv);
    taskEvents(task.id, taskContainer, taskDiv);
  })

  mainContent.innerHTML = `<h3>${menuTitle}</h3>`;
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
  taskElement.querySelector('#taskCheck').addEventListener('change', () => {
    checkTask(taskId, taskElement)
  });
 }

function checkTask(id, taskElement) {
  const tasks = getTasks();
  const taskTarget = tasks.find((task) => task.id === id);
  taskTarget.completed =! taskTarget.completed;
    saveTasks(tasks);
    console.log(tasks)
    taskElement.classList.toggle('checkedTasks');
}




function editTask(id) {
  editFlag = true;
  getProjects();
  getTaskToEdit(id)
  popUpEvents(id)
  activePopup();
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

function removeTask(id, taskContainer, taskElement) {
  const tasks = getTasks().filter((task) => task.id !== id);
  saveTasks(tasks);
  taskContainer.removeChild(taskElement);
  getProjects();
}

function addTask(id) {
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
    hidePopup()
    formReset();
  }
}

function updateTask(tasks, id, taskTitle, taskContent, taskDueDate, taskProject, taskPriority) {
  const task = tasks.find(task => task.id === id);
  if (task) {
    task.title = taskTitle;
    task.content = taskContent;
    task.priority = taskPriority;
    task.dueDate = taskDueDate;
    task.project = taskProject;
    

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
const todayBtn = document.getElementById('today');
const weekBtn = document.getElementById('week');
const projectBtn = document.getElementById('projectBtn');

let editFlag;

activePopup = () => taskPopUp.classList.add('popUpActive');
hidePopup = () => taskPopUp.classList.remove('popUpActive');
formReset = () => taskForm.reset();

homeBtn.onclick = () => getTasksToShow('All the tasks');
projectBtn.onclick = () => getTasksToShow('All the tasks');
todayBtn.onclick = () => getTasksToShow('Today tasks');
weekBtn.onclick = () => getTasksToShow('This Week tasks');

addButton.onclick = () => {
  editFlag = false;
  setPopupTitle("Add task")
  formReset();
  activePopup();
  getProjects();

};

function popUpEvents(id) {
  confirmBtn.onclick = (e) => {
    addTask(id);
    getTasksToShow();
    getProjects()
    e.preventDefault();
  }

  cancelBtn.onclick = () => {
    editFlag = false;
    hidePopup();


  }
}

getTasksToShow('All the tasks');
getProjects()
popUpEvents()
console.log(getTasks())


















