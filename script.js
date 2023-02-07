const Tasks = [
    { project: "Task 1" },
    { project: "Task 2" },
    { project: "Task 3" },
    { project: "Task 4" },
    { project: "Task 5" }
];


const projectInput =document.getElementById("projectInput")
projectInput.addEventListener('change',()=>console.log(teste.value))

const showProjectList = ()=>{
    const datalist = document.getElementById("projectList");
    Tasks.forEach(task => {
        let option = document.createElement("option");
        option.value = task.project;
        datalist.appendChild(option);
        
    })
}
showProjectList()

