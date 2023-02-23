import {getProjects} from './Ui.js'



export function createTask(id, title, content, dueDate, project, priority, completed) {
  return {
    id, title, content, dueDate, project, priority, completed,
  };
}

export function generateId() {
  return Math.floor(Math.random() * 9000);
}


export function saveTasks(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

export function getTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks') || '[]')
  return tasks;
}

export function removeTask(id, taskContainer, taskElement) {
  const tasks = getTasks().filter((task) => task.id !== id);
  saveTasks(tasks);
  taskContainer.removeChild(taskElement);
  getProjects();
}



export function updateTask(tasks, id, taskTitle, taskContent, taskDueDate, taskProject, taskPriority) {
  const task = tasks.find(task => task.id === id);
  if (task) {
    task.title = taskTitle;
    task.content = taskContent;
    task.priority = taskPriority;
    task.dueDate = taskDueDate;
    task.project = taskProject;
  }
}













