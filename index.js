window.addEventListener('load', () =>{
    const form = document.querySelector("#taskForm");
    const input = document.querySelector("#taskInput");
    const list_el = document.querySelector("#tasks");
    const deleteAllBtn = document.querySelector(".deleteAllBtn");

    // Load tasks from local storage if available
    let savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Function to save tasks to local storage
    const saveTasksToLocalStorage = () => {
        localStorage.setItem('tasks', JSON.stringify(savedTasks));
    };

    // Function to update the visibility of the deleteAllBtn
    const updateDeleteAllButtonVisibility = () => {
        if (savedTasks.length === 0) {
            deleteAllBtn.style.display = 'none'; // Hide the button if there are no tasks
        } else {
            deleteAllBtn.style.display = 'block'; // Show the button if there are tasks
        }
    };

    // Function to render tasks from savedTasks array
    const renderTasks = () => {
        list_el.innerHTML = ''; // Clear existing tasks
        savedTasks.forEach(task => {
            const tasks_el = document.createElement("div");
            tasks_el.classList.add("tasks");

            const tasks_content_el = document.createElement("div");
            tasks_content_el.classList.add("content");

            tasks_el.appendChild(tasks_content_el);

            const tasks_input_el = document.createElement("input");
            tasks_input_el.classList.add("text");
            tasks_input_el.type = "text";
            tasks_input_el.value = task;
            tasks_input_el.setAttribute("readonly", "readonly");

            tasks_content_el.appendChild(tasks_input_el);

            const tasks_actions_el = document.createElement("div");
            tasks_actions_el.classList.add("actions");

            const tasks_edit_el = document.createElement("button");
            tasks_edit_el.classList.add("edit");
            tasks_edit_el.innerHTML = "Edit";

            const tasks_delete_el = document.createElement("button");
            tasks_delete_el.classList.add("delete");
            tasks_delete_el.innerHTML = "Delete";

            tasks_actions_el.appendChild(tasks_edit_el);
            tasks_actions_el.appendChild(tasks_delete_el);

            tasks_el.appendChild(tasks_actions_el);

            list_el.appendChild(tasks_el);

            // Event listener for edit button
            tasks_edit_el.addEventListener('click', () => {
                if (tasks_edit_el.innerHTML.toLowerCase() == "edit"){
                    tasks_input_el.removeAttribute("readonly");
                    tasks_input_el.focus();
                    tasks_edit_el.innerText = "Save";
                } else {
                    tasks_input_el.setAttribute("readonly", "readonly");
                    tasks_edit_el.innerText = "Edit";
                    // Update task value in savedTasks array
                    const index = savedTasks.indexOf(task);
                    if (index !== -1) {
                        savedTasks[index] = tasks_input_el.value;
                        saveTasksToLocalStorage();
                    }
                }
            });

            // Event listener for delete button
            tasks_delete_el.addEventListener('click',()=>{
                list_el.removeChild(tasks_el);
                // Remove task from savedTasks array
                const index = savedTasks.indexOf(task);
                if (index !== -1) {
                    savedTasks.splice(index, 1);
                    saveTasksToLocalStorage();
                    updateDeleteAllButtonVisibility(); // Check if the deleteAllBtn should be hidden
                }
            });
        });
        updateDeleteAllButtonVisibility(); // Check if the deleteAllBtn should be hidden
    };

    // Render tasks when the page loads
    renderTasks();

    form.addEventListener('submit', (e) =>{
        e.preventDefault();

        const tasks = input.value;

        if (!tasks){
            alert("Please input a task");
            return;
        }

        savedTasks.push(tasks); // Add new task to savedTasks array
        saveTasksToLocalStorage(); // Save updated tasks to local storage
        renderTasks(); // Render tasks again with the new task
        input.value = ""; // Clear input field
    });

    // Event listener for delete all button
    deleteAllBtn.addEventListener('click', () => {
        list_el.innerHTML = ''; // Clear the task list on the page
        savedTasks = []; // Clear the savedTasks array
        saveTasksToLocalStorage(); // Update local storage
        updateDeleteAllButtonVisibility(); // Check if the deleteAllBtn should be hidden
    });
});