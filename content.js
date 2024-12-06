// Create the toggle button element dynamically
const toggleButton = document.createElement("button");
toggleButton.textContent = "+";
toggleButton.style.position = "absolute";
toggleButton.style.display = "none";  // Initially hidden
toggleButton.style.backgroundColor = "yellow";
toggleButton.style.color = "black";
toggleButton.style.padding = "10px 20px";
toggleButton.style.borderRadius = "50%";
toggleButton.style.fontSize = "20px";
toggleButton.style.cursor = "pointer";
toggleButton.style.zIndex = "10000";  // Ensure it appears on top

// Append the button to the body of the page
document.body.appendChild(toggleButton);

// Create a task manager form dynamically (hidden by default)
const taskManager = document.createElement("div");
taskManager.id = "taskManager";
taskManager.style.position = "absolute";
taskManager.style.display = "none"; // Initially hidden
taskManager.style.background = "white";
taskManager.style.border = "1px solid #ccc";
taskManager.style.padding = "20px";
taskManager.style.zIndex = "10000";  // Ensure it appears on top
taskManager.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
taskManager.innerHTML = `
  <h2>Task Manager</h2>
  <form id="taskForm">
    <div class="form-section">
      <label for="taskName">Task Name:</label>
      <input type="text" id="taskName" name="taskName" placeholder="Enter task name">
    </div>
    <div class="form-section">
      <label for="deadline">Deadline:</label>
      <input type="date" id="deadline" name="deadline">
    </div>
    <div class="form-section">
      <label for="notes">Notes:</label>
      <textarea id="notes" name="notes" placeholder="Add any notes"></textarea>
    </div>
    <div class="form-section">
      <button type="submit">Add Task</button>
    </div>
  </form>
  <div id="taskDetailsContainer"></div>
`;

document.body.appendChild(taskManager);

// Function to show the button when text is selected
function showButtonForSelectedText() {
  const selection = window.getSelection();
  if (selection.toString().length > 0) {  // If text is selected
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    console.log('Selected text:', selection.toString());  // Debugging: Log the selected text
    console.log('Button position:', rect.left + window.scrollX, rect.top + window.scrollY);  // Debugging: Log the position

    // Position the button near the selected text
    toggleButton.style.left = `${rect.left + window.scrollX + 10}px`;
    toggleButton.style.top = `${rect.top + window.scrollY - 40}px`;

    // Show the button
    toggleButton.style.display = "block";
  }
}

// Detect when text is selected
document.addEventListener('mouseup', function() {
  showButtonForSelectedText();
});

// Hide the button if no text is selected or if the user clicks elsewhere
document.addEventListener('mousedown', function(event) {
  if (!window.getSelection().toString()) {
    toggleButton.style.display = "none";  // Hide button when no text is selected
  }
});

// When the toggle button is clicked, show the task manager
toggleButton.addEventListener("click", function() {
  taskManager.style.display = "block";  // Show the task manager form
  const rect = toggleButton.getBoundingClientRect();
  taskManager.style.left = `${rect.left + window.scrollX}px`;
  taskManager.style.top = `${rect.top + window.scrollY + toggleButton.offsetHeight + 10}px`;  // Position it below the button
  toggleButton.style.display = "none";  // Hide the toggle button after click
});

// Handle task form submission
document.getElementById("taskForm")?.addEventListener("submit", function(event) {
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

  // Display the task in the task manager
  displayTaskAdded(task);

  // Clear form
  document.getElementById("taskForm").reset();
});

// Format the date into a readable format
function formatDate(date) {
  const d = new Date(date);
  return d.toDateString();
}

// Display the newly added task in the task manager
function displayTaskAdded(task) {
  let taskDetailsContainer = document.getElementById("taskDetailsContainer");
  let taskItem = document.createElement('div');
  taskItem.classList.add('task-item');

  let taskDetails = document.createElement('span');
  taskDetails.innerHTML = `<strong>${task.name}</strong> due by <strong>${task.deadline}</strong>`;

  taskItem.appendChild(taskDetails);
  taskDetailsContainer.appendChild(taskItem);
}
