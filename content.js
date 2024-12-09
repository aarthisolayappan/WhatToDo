// all divs and buttons that needed to be added when the chrome extension is active


  //create a function to show the toggle button when text is higlighted on the webpage
document.addEventListener('mouseup', function() {
  showButtonForSelectedText();
});

document.addEventListener('mousedown', function(event) {
  const selection = window.getSelection();
  if (!selection.toString()) {
    toggleButton.style.display = "none";
  }
  else if (event.target !== toggleButton && !toggleButton.contains(event.target)) {
    toggleButton.style.display = "none";
  }
});

  //when the popup comes, the input field for the task name should have the highlighted text
function showButtonForSelectedText() {
  const selection = window.getSelection();
  const taskNameInput = document.getElementById("taskName");

  if (selection.toString().length > 0) {
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    toggleButton.style.left = `${rect.left + window.scrollX + 10}px`;
    toggleButton.style.top = `${rect.top + window.scrollY - 40}px`;
    toggleButton.style.display = "block";

    taskNameInput.value = selection.toString();
  }
}

  //create the first (+) button 
  //link css styling for the toggle button
  //add the button to the body of the html
const toggleButton = document.createElement("button");
toggleButton.id = "toggleButton"; 
toggleButton.textContent = "+";
document.body.appendChild(toggleButton);


  //create a (form) div for the popup to enter the task and deadline
  //link css styling for the popup
  //add all the html (form) elements in the popup with a button to add and see all tasks to another popup
  //needs an add task button, see all tasks button and a close button
  //add the poopup to the body so its a floating element
const popup = document.createElement("div");
popup.id = "popUp";
popup.innerHTML = `
  <div>
    <form id="taskForm">
        <div>
            <label for="taskName">Task Name:</label>
            <input type="text" id="taskName" placeholder="Enter task name">
        </div>
        <div>
            <label for="deadline">Deadline:</label>
            <input type="date" id="deadline">
        </div>
        <div>
            <label>Add Task to Other Open Tabs:</label>
            <div id="tabsList"></div>
        </div>
        <div>
            <button type="submit" id="addTasks">Add Task</button>
            <button type="button" id="seeAllTasks">See All Tasks</button>
        </div>
    </form>
    <button id="closePopUpButton" class="closeButton">Close</button>
  </div>
`; 

document.body.appendChild(popup);


  //clicking the toggle button opens this popup and is positioned accordingly
  //when the popup is opened
    //it needs to load the open chrome tabs
    //close the toggle button
toggleButton.addEventListener("click", function() {
  if (popup.style.display === "none") {
    popup.style.display = "block";
    popup.style.left = `${toggleButton.offsetLeft}px`;
    popup.style.top = `${toggleButton.offsetTop + 60}px`;
    toggleButton.style.display = "none";
  
    loadTabs();
  } else {
    popup.style.display = "none";
    toggleButton.style.display = "block";
  }
});
  

  //get chrome tabs
  //remove everything from the tabslist and add to tabslist 
  //give a class styling for each tab icon
    //title if the website does not have a favicon
  //add the tabicons to the tabslist
function loadTabs() {
  chrome.runtime.sendMessage({action: "getTabs"}, function(response) {
    const tabs = response.tabs;
    const tabsListContainer = document.getElementById("tabsList");

    tabsListContainer.innerHTML = ''; 

    tabs.forEach(tab => {
      const tabIcon = document.createElement('img');
      tabIcon.src = tab.favIconUrl;
      tabIcon.alt = tab.title;
      tabIcon.title = tab.title;

      tabIcon.classList.add("tabIcon");

      tabsListContainer.appendChild(tabIcon);
    });
  });
}

const seeAllTasksButton = document.getElementById("seeAllTasks");
seeAllTasksButton.addEventListener("click", function() {
  popup.style.display = "none";
  taskAddedPopUp.style.display = "block";
  toggleButton.style.display = "none";
    
  updateTaskList();
});
  
const closePopUpButton = document.getElementById("closePopUpButton");
closePopUpButton.addEventListener("click", function() {
  popup.style.display = "none"; 
  toggleButton.style.display = "block"; 
});


  //formatting date in a word format instead of just numbers
function formatDate(date) {
  const d = new Date(date);
  return d.toDateString();
}
  
  //need to store the added tasks so create an empty array
  //the task will be stored using inputted data: task name and deadline
  //if there is no task name, it will show an alert
  //date is formatted as explained above
  //create each task as an object so it can be accessed easily and modified with more input fields easily
  //the task object is added to the empty task array
  //once the task is added, the form need to reset itself
  //when the submit button is clicked, the plus button and the first popup should close and the secondpopup should open
let tasks = [];
  
const taskForm = document.getElementById("taskForm");
taskForm.addEventListener("submit", function(event) {
  event.preventDefault();

  const taskName = document.getElementById("taskName").value;
  const deadline = document.getElementById("deadline").value;

  if (!taskName) {
    alert("Task name is required!");
    return;
  }

  const formattedDeadline = formatDate(deadline || new Date());
  const task = {
    name: taskName,
    deadline: formattedDeadline
  };

  tasks.push(task);
  saveTasks();
  updateTaskList();

  taskForm.reset();

  popup.style.display = "none";
  toggleButton.style.display = "none";  
  taskAddedPopUp.style.display = "block"; 
});
  

  //create a container for all the tasks
  //needs a close button
  //adds itself to the body as a floating element after interacting with the first popup
const taskAddedPopUp = document.createElement("div");
taskAddedPopUp.id = "taskAddedPopUp";
taskAddedPopUp.innerHTML = `
  <div class="task-container">
    <h3>Task list</h3>
    <div id="taskDetailsContainer"></div>       
    <div id="allTasksContainer"></div>
  </div>
  <button id = "closeTaskButton" class="closeButton">Close</button>
`;

document.body.appendChild(taskAddedPopUp);


  //update task list whenever new task is added
  //it is meant to refresh and show the updated task list so clear all existing elements to avoid repetition
  //if there are no tasks, display that there are no tasks 
  //else, create a div to store each task with deadline
  //for each task, it needs to add a complete button and a remove button to itself
    //the complete button should strike it off
    //the remove button should remove it from the container
  //all changes made should be saved
  //each task div needs to be added to the taskaddedpopup
function updateTaskList() {
  const taskDetailsContainer = document.getElementById("taskDetailsContainer");
  taskDetailsContainer.innerHTML = "";

  if (tasks.length === 0) {
    taskDetailsContainer.innerHTML = "<p>No tasks added yet.</p>";
  } else {
    tasks.forEach((task, index) => { 
      const taskDiv = document.createElement("div");
      taskDiv.classList.add("task");
      taskDiv.innerHTML = `
        <p>${task.name}</p>
        <p><strong>Deadline: ${task.deadline}</strong></p>
      `;

      const completeButton = document.createElement("button");
      completeButton.textContent = "Mark as Completed";
      completeButton.id = "completedButton";
      completeButton.addEventListener("click", function() {
        taskDiv.style.textDecoration = "line-through";
        taskDiv.style.color = "green";
      });

      const removeButton = document.createElement("button");
      removeButton.textContent = "Remove";
      removeButton.id = "removeButton";
      removeButton.addEventListener("click", function() {
        taskDiv.remove();  
        tasks.splice(index, 1);

        if (tasks.length === 0) {
          taskDetailsContainer.innerHTML = "<p>No tasks added yet.</p>";
        }
        
        saveTasks();
      });

      taskDiv.appendChild(completeButton);
      taskDiv.appendChild(removeButton);

      taskDetailsContainer.appendChild(taskDiv);
    });
  }
}

  //function to save tasks to localStorage whenever the task array changes
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

  //function to load tasks from localStorage when the page loads
function loadTasks() {
  const savedTasks = localStorage.getItem("tasks");
  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
  } else {
    tasks = [];
  }
}

const closeTaskButton = document.getElementById("closeTaskButton");
closeTaskButton.addEventListener("click", function() {
  taskAddedPopUp.style.display = "none";
});

  //load and show tasks from browsers local storage - shows previously added tasks and doesnt remove them page is reloaded
document.addEventListener("DOMContentLoaded", function() {
  loadTasks();  
  updateTaskList();
});
