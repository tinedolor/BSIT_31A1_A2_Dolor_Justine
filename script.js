document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskButton = document.getElementById('addTaskButton');
    const taskList = document.getElementById('taskList');
    const taskHistory = document.getElementById('taskHistory');

    // Load tasks and history from localStorage
    loadTasks();
    loadHistory();

    addTaskButton.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    function addTask() {
        const task = taskInput.value.trim();
        if (task) {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
            listItem.innerHTML = `
                <span class="task-text">${task}</span>
                <div>
                    <button class="btn btn-sm btn-warning edit-button">Edit</button>
                    <button class="btn btn-sm btn-success done-button">Done</button>
                    <button class="btn btn-sm btn-danger delete-button">Delete</button>
                </div>
            `;
            taskList.appendChild(listItem);
            taskInput.value = '';

            // Save tasks to localStorage
            saveTasks();
        } else {
            alert('Task cannot be empty!'); // Validation
        }
    }

    taskList.addEventListener('click', (e) => {
        const listItem = e.target.parentElement.parentElement;
        const taskText = listItem.querySelector('.task-text');

        if (e.target.classList.contains('delete-button')) {
            taskList.removeChild(listItem);
        } else if (e.target.classList.contains('done-button')) {
            // Move the task to the history section
            moveTaskToHistory(listItem);
        } else if (e.target.classList.contains('edit-button')) {
            const newTask = prompt('Edit your task:', taskText.textContent);
            if (newTask && newTask.trim()) {
                taskText.textContent = newTask.trim();
            } else {
                alert('Task cannot be empty!'); // Validation
            }
        }

        // Save tasks to localStorage after any change
        saveTasks();
    });

    taskHistory.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-button')) {
            const listItem = e.target.parentElement.parentElement;
            taskHistory.removeChild(listItem);

            // Save history to localStorage after deletion
            saveHistory();
        }
    });

    function moveTaskToHistory(listItem) {
        const taskText = listItem.querySelector('.task-text');
        const historyItem = document.createElement('li');
        historyItem.className = 'list-group-item d-flex justify-content-between align-items-center';
        historyItem.innerHTML = `
            <span class="task-text completed">${taskText.textContent}</span>
            <button class="btn btn-sm btn-danger delete-button">Delete</button>
        `;
        taskHistory.appendChild(historyItem);
        taskList.removeChild(listItem);

        // Save task and history to localStorage
        saveTasks();
        saveHistory();
    }

    function saveTasks() {
        const tasks = [];
        document.querySelectorAll('#taskList .task-text').forEach(task => {
            tasks.push({
                text: task.textContent,
                completed: false // Tasks in the main list are not completed
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function saveHistory() {
        const history = [];
        document.querySelectorAll('#taskHistory .task-text').forEach(task => {
            history.push({
                text: task.textContent,
                completed: true //Completed Tasks
            });
        });
        localStorage.setItem('history', JSON.stringify(history));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
            listItem.innerHTML = `
                <span class="task-text">${task.text}</span>
                <div>
                    <button class="btn btn-sm btn-warning edit-button">Edit</button>
                    <button class="btn btn-sm btn-success done-button">Done</button>
                    <button class="btn btn-sm btn-danger delete-button">Delete</button>
                </div>
            `;
            taskList.appendChild(listItem);
        });
    }

    function loadHistory() {
        const history = JSON.parse(localStorage.getItem('history')) || [];
        history.forEach(task => {
            const historyItem = document.createElement('li');
            historyItem.className = 'list-group-item d-flex justify-content-between align-items-center';
            historyItem.innerHTML = `
                <span class="task-text completed">${task.text}</span>
                <button class="btn btn-sm btn-danger delete-button">Delete</button>
            `;
            taskHistory.appendChild(historyItem);
        });
    }
});