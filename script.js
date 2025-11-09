document.addEventListener("DOMContentLoaded", () => {

    // === 1. SELECTORS ===
    const todoForm = document.getElementById("todo-form");
    const todoInput = document.getElementById("todo-input");
    const todoList = document.getElementById("todo-list");
    const totalCountEl = document.getElementById("total-count");
    const activeCountEl = document.getElementById("active-count");
    const doneCountEl = document.getElementById("done-count"); 
    const ratePercentageEl = document.getElementById("rate-percentage");
    const filterBtnContainer = document.querySelector(".filter-buttons");
    const filterBtns = document.querySelectorAll(".filter-btn");
    const clearCompletedBtn = document.getElementById("clear-completed");

    
    // === 2. STATE ===
    let tasks = JSON.parse(localStorage.getItem('todos')) || [];
    let currentFilter = 'all'; 

    
    // === 3. CORE FUNCTIONS ===

    function saveTasks() {
        localStorage.setItem('todos', JSON.stringify(tasks));
    }

    function render() {
        // 1. Render Task List
        todoList.innerHTML = ""; 
        
        const filteredTasks = getFilteredTasks();

        filteredTasks.forEach(task => {
            const li = document.createElement("li");
            li.className = `todo-item ${task.completed ? 'completed' : ''}`;
            li.dataset.id = task.id; 

            // MODIFIED: Use a real checkbox and label
            li.innerHTML = `
                <input type="checkbox" 
                       class="task-checkbox" 
                       id="task-${task.id}" 
                       data-id="${task.id}" 
                       ${task.completed ? 'checked' : ''}>
                <label for="task-${task.id}" class="task-text">${task.text}</label>
            `;
            todoList.appendChild(li);
        });

        // 2. Update Stats
        updateStats();

        // 3. Update Active Filter Button
        updateFilterButtons();
    }

    function updateStats() {
        const total = tasks.length;
        const active = tasks.filter(task => !task.completed).length;
        const done = total - active; 

        totalCountEl.textContent = total;
        activeCountEl.textContent = active;
        doneCountEl.textContent = done; 

        if (total === 0) {
            ratePercentageEl.textContent = "0%";
        } else {
            const percentage = Math.round((done / total) * 100);
            ratePercentageEl.textContent = `${percentage}%`;
        }
    }

    function updateFilterButtons() {
        filterBtns.forEach(btn => {
            if (btn.dataset.filter === currentFilter) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    function getFilteredTasks() {
        switch (currentFilter) {
            case 'active':
                return tasks.filter(task => !task.completed);
            case 'completed': 
                return tasks.filter(task => task.completed);
            default: // 'all'
                return tasks;
        }
    }


    // === 4. EVENT HANDLERS ===

    todoForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const taskText = todoInput.value.trim();

        if (taskText !== "") {
            const newTask = {
                id: Date.now(), 
                text: taskText,
                completed: false
            };
            tasks.push(newTask);
            saveTasks();
            render();
            todoInput.value = "";
        }
    });

    // MODIFIED: Replaced 'click' listener with a 'change' listener
    // This is a cleaner way to handle checkbox toggles
    todoList.addEventListener("change", (e) => {
        // Check if the event came from our checkbox
        if (e.target.classList.contains('task-checkbox')) {
            const taskId = Number(e.target.dataset.id);
            const task = tasks.find(t => t.id === taskId);
            if (!task) return;

            // Update the task's state to match the checkbox
            task.completed = e.target.checked;
            
            saveTasks();
            // Re-render to update stats and 'completed' class on the <li>
            render(); 
        }
    });
    // OLD todoList.addEventListener("click", ...) is removed.

    filterBtnContainer.addEventListener("click", (e) => {
        if (e.target.classList.contains('filter-btn')) {
            currentFilter = e.target.dataset.filter;
            render();
        }
    });

    clearCompletedBtn.addEventListener("click", () => {
        tasks = tasks.filter(task => !task.completed);
        saveTasks();
        render();
    });


    // === 5. INITIAL LOAD ===
    render();

});