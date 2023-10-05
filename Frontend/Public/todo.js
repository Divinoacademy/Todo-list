const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTaskButton");
const todoList = document.getElementById("todoList");
const completedList = document.getElementById("completedList");
const clearTodoButton = document.getElementById("clearTodoButton");
const clearCompletedButton = document.getElementById("clearCompletedButton");

// Replace with your API URL
const apiUrl = "http://localhost:8080/api/tasks";


document.addEventListener("DOMContentLoaded", displayTask);
addTaskButton.addEventListener("click", addTask)
taskInput.addEventListener('keydown', function(e) {
  // Check if the key pressed is Enter (keycode 13)
  if (event.keyCode === 13) {
    // Call your function here
    addTask();
  }
});
clearTodoButton.addEventListener("click",clearTodoList)
clearCompletedButton.addEventListener("click", clearCompletedList)


async function displayTask() {
    //const taskText = taskInput.value.trim();
//    if (taskText !== "") {
        try {
            const response = await fetch(apiUrl, {
                method: "GET",
               /* headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text: taskText, completed: false }), */
            });
            if (response.ok) {
                const task = await response.json();
                console.log(`Displayed Task: ${task}`);
                console.log(response)
                if (task != "") {
                    task.forEach(obj => {
                        createTaskElement(obj)
                    })
                }
                taskInput.value = "";
            }
        } catch (error) {
            console.error("Error adding task:", error);
        }
//    }
}


async function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText !== "") {
        try {
              
            const response = await fetch(`${apiUrl}/createTask`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text: taskText, completed: false }),
            });
          setTimeout( async function() {
            if (response.ok) {
                const task = await response.json();
                console.log(`Added task: ${task}`)
                createTaskElement(task);
            }
          }, 300);
        } catch (error) {
            console.error("Error adding task:", error);
            taskInput.value ="";
        }
    }
}

function createTaskElement(task) {
    const listItem = document.createElement("li");
    listItem.textContent = task.text;
    listItem.setAttribute('data-task-id', task.id);
    
    if (task.completed) {
        completedList.appendChild(listItem);
        listItem.addEventListener("click", uncompleteTask);
    } else {
        todoList.appendChild(listItem);
        listItem.addEventListener("click", completeTask);
    }
}

async function completeTask() {
    const listItem = this;
    const taskId = listItem.getAttribute("data-task-id");
    
    try {
        const response = await fetch(`${apiUrl}/changeStatus/${taskId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
            id: taskId,
            completed: true }),
        });
        if (response.ok) {
            console.log(response.json())
            completedList.appendChild(listItem);
            listItem.removeEventListener("click", completeTask);
            listItem.addEventListener("click", uncompleteTask);
        }
    } catch (error) {
        console.error("Error completing task:", error);
    }
}

// Implement uncompleteTask function similarly to completeTask

async function uncompleteTask() {
    const listItem = this;
    const taskId = listItem.getAttribute("data-task-id");
    
    try {
        const response = await fetch(`${apiUrl}/changeStatus/${taskId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
            id: taskId,
            completed: true }),
        });
        if (response.ok) {
            console.log(response.json());
            todoList.appendChild(listItem);
            listItem.removeEventListener("click", uncompleteTask);
            listItem.addEventListener("click", completeTask);
        }
    } catch (error) {
        console.error("Error completing task:", error);
    }
}

async function clearTodoList() {
    try {
        const response = await fetch(`${apiUrl}/deleteStatus/${false}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ completed: false }),
        });
        
        if (response.ok) {
            console.log(response.json());
            todoList.innerHTML = "";
        }
    
    } catch (error) {
        console.error("Error clearing todo list:", error);
    }
}

async function clearCompletedList() {
    try {
        const response = await fetch(`${apiUrl}/deleteStatus/${true}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
            completed: true }),
        });
        
        if (response.ok) {
            console.log(response.json());
            completedList.innerHTML = "";
        }
        
    } catch (error) {
        console.error("Error clearing completed list:", error);
    }
}

