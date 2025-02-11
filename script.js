document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const priorityInput = document.getElementById('priorityInput');
    const dueDateInput = document.getElementById('dueDateInput');
    const addTaskButton = document.getElementById('addTaskButton');
    const taskList = document.getElementById('taskList');
    const taskHistory = document.getElementById('taskHistory');

    // Load tasks and history from localStorage when the page loads
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
        const priority = priorityInput.value;
        const dueDate = dueDateInput.value;

        if (task) {
            const listItem = document.createElement('li');
            listItem.className = `list-group-item d-flex justify-content-between align-items-center task-item ${priority}`;
            listItem.innerHTML = `
                <div class="task-details">
                    <span class="task-text">${task}</span>
                    <small class="text-muted">Due: ${dueDate || 'No due date'}</small>
                </div>
                <div>
                    <button class="btn btn-sm btn-warning edit-button">Edit</button>
                    <button class="btn btn-sm btn-success done-button">Done</button>
                    <button class="btn btn-sm btn-danger delete-button">Delete</button>
                </div>
            `;
            taskList.appendChild(listItem);
            taskInput.value = '';
            dueDateInput.value = '';

            // Save tasks to localStorage
            saveTasks();
            sortTasks(); // Sort tasks after adding a new one
        } else {
            alert('Task cannot be empty!'); // Validation: Prevent empty tasks
        }
    }

    taskList.addEventListener('click', (e) => {
        const listItem = e.target.parentElement.parentElement;
        const taskText = listItem.querySelector('.task-text');

        if (e.target.classList.contains('delete-button')) {
            taskList.removeChild(listItem);
        } else if (e.target.classList.contains('done-button')) {
            moveTaskToHistory(listItem);
        } else if (e.target.classList.contains('edit-button')) {
            const newTask = prompt('Edit your task:', taskText.textContent);
            if (newTask && newTask.trim()) {
                taskText.textContent = newTask.trim();
            } else {
                alert('Task cannot be empty!'); // Validation
            }
        }


        saveTasks();
    });


    taskHistory.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-button')) {
            const listItem = e.target.closest('li');
            listItem.remove(); // Remove the task from the history

            // Save history to localStorage
            saveHistory();
        }
    });

    function moveTaskToHistory(listItem) {
        const taskText = listItem.querySelector('.task-text');
        const dueDate = listItem.querySelector('.text-muted').textContent;
        const historyItem = document.createElement('li');
        historyItem.className = 'list-group-item d-flex justify-content-between align-items-center';
        historyItem.innerHTML = `
            <span class="task-text completed">${taskText.textContent}</span>
            <small class="text-muted">${dueDate}</small>
            <button class="btn btn-sm btn-danger delete-button">Delete</button>
        `;
        taskHistory.appendChild(historyItem);
        taskList.removeChild(listItem);

        // Save tasks and history to localStorage
        saveTasks();
        saveHistory();
    }

    function saveTasks() {
        const tasks = [];
        document.querySelectorAll('#taskList .task-item').forEach(task => {
            tasks.push({
                text: task.querySelector('.task-text').textContent,
                priority: task.classList.contains('high') ? 'high' : task.classList.contains('medium') ? 'medium' : 'low',
                dueDate: task.querySelector('.text-muted').textContent.replace('Due: ', '') || null,
                completed: false
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function saveHistory() {
        const history = [];
        document.querySelectorAll('#taskHistory .list-group-item').forEach(task => {
            history.push({
                text: task.querySelector('.task-text').textContent,
                dueDate: task.querySelector('.text-muted').textContent.replace('Due: ', '') || null,
                completed: true
            });
        });
        localStorage.setItem('history', JSON.stringify(history));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            const listItem = document.createElement('li');
            listItem.className = `list-group-item d-flex justify-content-between align-items-center task-item ${task.priority}`;
            listItem.innerHTML = `
                <div class="task-details">
                    <span class="task-text">${task.text}</span>
                    <small class="text-muted">Due: ${task.dueDate || 'No due date'}</small>
                </div>
                <div>
                    <button class="btn btn-sm btn-warning edit-button">Edit</button>
                    <button class="btn btn-sm btn-success done-button">Done</button>
                    <button class="btn btn-sm btn-danger delete-button">Delete</button>
                </div>
            `;
            taskList.appendChild(listItem);
        });
        sortTasks();
        highlightOverdueTasks(); // Highlight overdue tasks
    }

    function loadHistory() {
        const history = JSON.parse(localStorage.getItem('history')) || [];
        history.forEach(task => {
            const historyItem = document.createElement('li');
            historyItem.className = 'list-group-item d-flex justify-content-between align-items-center';
            historyItem.innerHTML = `
                <span class="task-text completed">${task.text}</span>
                <small class="text-muted">${task.dueDate || 'No due date'}</small>
                <button class="btn btn-sm btn-danger delete-button">Delete</button>
            `;
            taskHistory.appendChild(historyItem);
        });
    }

    function sortTasks() {
        const tasks = Array.from(taskList.querySelectorAll('.task-item'));
        tasks.sort((a, b) => {
            const priorityOrder = { high: 1, medium: 2, low: 3 };
            const priorityA = priorityOrder[a.classList.contains('high') ? 'high' : a.classList.contains('medium') ? 'medium' : 'low'];
            const priorityB = priorityOrder[b.classList.contains('high') ? 'high' : b.classList.contains('medium') ? 'medium' : 'low'];
            return priorityA - priorityB;
        });
        tasks.forEach(task => taskList.appendChild(task));
    }

    function highlightOverdueTasks() {
        const today = new Date().toISOString().split('T')[0];
        document.querySelectorAll('#taskList .task-item').forEach(task => {
            const dueDate = task.querySelector('.text-muted').textContent.replace('Due: ', '');
            if (dueDate && dueDate < today) {
                task.classList.add('overdue');
            }
        });
    }
});