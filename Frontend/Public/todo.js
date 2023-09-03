const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTaskButton");
const todoList = document.getElementById("todoList");
const completedList = document.getElementById("completedList");
const clearTodoButton = document.getElementById("clearTodoButton");
const clearCompletedButton = document.getElementById("clearCompletedButton");

addTaskButton.addEventListener("click", addTask);
clearTodoButton.addEventListener("click", clearTodoList);
clearCompletedButton.addEventListener("click", clearCompletedList);










function addTask() {
    const taskText = taskInput.value.trim();
    console.log(taskText)
    if (taskText !== "") {
        const listItem = document.createElement("li");
        listItem.textContent = taskText;
        listItem.addEventListener("click", completeTask);
        todoList.appendChild(listItem);
        taskInput.value = "";
    }
}
function completeTask() {
    const listItem = this;
    completedList.appendChild(listItem);
    listItem.removeEventListener("click", completeTask);
    listItem.addEventListener("click", uncompleteTask);
}
function uncompleteTask() {
    const listItem = this;
    console.log(this)
    todoList.appendChild(listItem);
    listItem.removeEventListener("click", uncompleteTask);
    listItem.addEventListener("click", completeTask);
}

function clearTodoList() {
    todoList.innerHTML = "";
}

function clearCompletedList() {
    completedList.innerHTML = "";
}


/*
const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTaskButton");
const todoList = document.getElementById("todoList");
const completedList = document.getElementById("completedList");
const clearTodoButton = document.getElementById("clearTodoButton");
const clearCompletedButton = document.getElementById("clearCompletedButton");

addTaskButton.addEventListener("click", addTask);
clearTodoButton.addEventListener("click", clearTodoList);
clearCompletedButton.addEventListener("click", clearCompletedList);

// Replace with your API URL
const apiUrl = "https://your-api-url.com/tasks";

async function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText !== "") {
        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text: taskText, completed: false }),
            });
            if (response.ok) {
                const task = await response.json();
                createTaskElement(task);
                taskInput.value = "";
            }
        } catch (error) {
            console.error("Error adding task:", error);
        }
    }
}

function createTaskElement(task) {
    const listItem = document.createElement("li");
    listItem.textContent = task.text;
    
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
        const response = await fetch(`${apiUrl}/${taskId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ completed: true }),
        });
        if (response.ok) {
            completedList.appendChild(listItem);
            listItem.removeEventListener("click", completeTask);
            listItem.addEventListener("click", uncompleteTask);
        }
    } catch (error) {
        console.error("Error completing task:", error);
    }
}

// Implement uncompleteTask function similarly to completeTask

async function clearTodoList() {
    try {
        await fetch(`${apiUrl}/clear-todo`, {
            method: "DELETE",
        });
        todoList.innerHTML = "";
    } catch (error) {
        console.error("Error clearing todo list:", error);
    }
}

async function clearCompletedList() {
    try {
        await fetch(`${apiUrl}/clear-completed`, {
            method: "DELETE",
        });
        completedList.innerHTML = "";
    } catch (error) {
        console.error("Error clearing completed list:", error);
    }
}

*/