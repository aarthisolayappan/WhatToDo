    document.addEventListener("DOMContentLoaded", function(){

        // event listeners for the buttons that toggle and close the popup
        let toggleButton = document.querySelector(".togglePopUp");
        let closeButton = document.getElementById("closeTaskPopup");
    
        toggleButton.addEventListener("click", togglePopUp);
        closeButton.addEventListener("click", closeTaskAddedPopup); 

        document.getElementById("newTaskNameInPopup").addEventListener("keydown", function(event) {
            if (event.key === "Enter") {
                submitNewTaskFromPopup(); 
                event.preventDefault(); 
            };
        });
    });

        // first popup
    function togglePopUp(){
        let popUp = document.getElementById("myPopUp");
        let button = document.querySelector(".togglePopUp");
        let buttonRect = button.getBoundingClientRect();
    
        // to open (or close) and position the popup near the toggle button if the popup is hidden or its an empty string
        if (popUp.style.display === "none" || popUp.style.display === "") {
            popUp.style.left = buttonRect.left + 52 + "px";
            popUp.style.top = buttonRect.bottom - 25 + "px";    
            popUp.style.display = "block";
            button.textContent = "-";
        } else {
            popUp.style.display = "none";
            button.textContent = "+";
        };
    };

    function formatDate(date){
        const d = new Date(date);
        return d.toDateString();
    };   
    
        // storing created tasks
    var tasks = [];


    // getting task from first pop up after submitting
        // need to make sure the page doesnt reload everytime a task is added
        // get the value of all three form inputs
        // check if theres a task name - form cannot be submitted if theres no name
        // add deadline by default if theres nothing from the form input
        // create task object with all the three form inputs 
        // push it to the empty array of tasks in the pop up
        // once the form is submitted it needs to:
            // remove all entered information from the pop up
            // close the first pop up
        // add the added task to the second popup
    function submitTask(event) {
        event.preventDefault(); 
        
        var taskName = document.getElementById("taskName").value;
        var deadline = document.getElementById("deadline").value;
        
        if (!taskName) {
            alert("Task name is required!");  
            return;
        }

        var formattedDeadline = formatDate(deadline || new Date());

        var task = {
            name: taskName,
            deadline: formattedDeadline,
        };

        tasks.push(task);
        
        document.getElementById("taskForm").reset();
        
        let popUp = document.getElementById("myPopUp");
        if (popUp) {
            popUp.style.display = "none";
        }

        displayTaskAdded(task);
    };


    // giving user the chance to add a popup directly to the list without going through the first popup
        // repeat the same thing but change the id to newtask
    function submitNewTaskFromPopup() {
        var newTaskName = document.getElementById("newTaskNameInPopup").value;
        var deadline = document.getElementById("deadline").value; // Optional field (can be blank)

        var formattedDeadline = formatDate(deadline || new Date());

        var task = {
            name: newTaskName,
            deadline: formattedDeadline,
        };

        tasks.push(task);

        document.getElementById("newTaskNameInPopup").value = "";

        displayTaskAdded(task);  
    };


     // displaying newly added task in another popup
        // pull the tasks container
        // add a task item to it
        // add the hollow circle next to it
        // when the circle is clicked it needs to become hollow
        // when the task is created it needs to pull the information from submitted info by calling the object
        // add the circle and tasks details to the taskitem div
        // add the taskitem div to the task container
    function displayTaskAdded(task) {
        let taskDetailsContainer = document.getElementById("taskDetailsContainer");
        let taskItem = document.createElement('div');
        taskItem.classList.add('task-item');
    
        let taskCircle = document.createElement('div');
        taskCircle.classList.add('task-circle');
    
        taskCircle.addEventListener('click', function() {
            taskCircle.classList.toggle('filled');
        });
    
        let taskDetails = document.createElement('span');
        taskDetails.innerHTML = `<strong>${task.name}</strong> due by <strong>${task.deadline}</strong>`;
            //tried read.only to make it editable, didnt work
    
        taskItem.appendChild(taskCircle);
        taskItem.appendChild(taskDetails);
    
        taskDetailsContainer.appendChild(taskItem);
    
        let taskAddedPopUp = document.getElementById("taskAddedPopUp");
        taskAddedPopUp.style.display = "block";
    };


    // show all tasks in the second popup when the See All Tasks button is clicked
        // first pop up should be hidden when clicked on this button
        // show the second popup 
    function showAllTasks() {
        var taskFormPopUp = document.getElementById("myPopUp");
        taskFormPopUp.style.display = "none";
    
        var taskAddedPopUp = document.getElementById("taskAddedPopUp");
        taskAddedPopUp.style.display = "block";
    };

    // to close the Task Added second popup
    function closeTaskAddedPopup() {
        var taskAddedPopUp = document.getElementById("taskAddedPopUp");
        taskAddedPopUp.style.display = "none"; 
    }

    
    //questions to ask:
        // how to make the entered info editable on the second pop up
        // how to include the 'completed' section of the task list with undo function
        // how to edit the date in the second pop up
        // how to activate the popup only when dragging text 
        // when pop up activated in chrome, not able to see anything else except the plus and minus sign