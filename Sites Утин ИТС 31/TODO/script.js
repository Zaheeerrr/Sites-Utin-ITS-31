const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-btn");
const todosList = document.getElementById("tasks-list");
const itemsLeft = document.getElementById("items-left");
const clearCompletedBtn = document.getElementById("clear-completed");
const emptyState = document.getElementById("empty-state");
const dateElement = document.getElementById("date");
const filterBtns = document.querySelectorAll(".filter-btn");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let currentFilter = "all";

// Инициализация приложения
function init() {
    updateDate();
    renderTodos();
    updateItemsCount();
    checkEmptyState();
    
    // Загрузка сохраненных задач
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
        todos = JSON.parse(savedTodos);
        renderTodos();
    }
}

// Обновление даты
function updateDate() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    dateElement.innerHTML = `<strong>${now.toLocaleDateString('ru-RU', options)}</strong>`;
}

// Обработчики событий
addTaskBtn.addEventListener("click", () => {
    addTodo(taskInput.value);
});

taskInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addTodo(taskInput.value);
});

clearCompletedBtn.addEventListener("click", () => {
    clearCompleted();
});

filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        // Убираем активный класс у всех кнопок
        filterBtns.forEach(b => b.classList.remove("active"));
        // Добавляем активный класс к нажатой кнопке
        btn.classList.add("active");
        // Устанавливаем текущий фильтр
        currentFilter = btn.dataset.filter;
        renderTodos();
        checkEmptyState();
    });
});

// Функции для работы с задачами
function addTodo(text) {
    if (text.trim() === "") return;

    const todo = {
        id: Date.now(),
        text: text.trim(),
        completed: false
    };

    todos.push(todo);
    saveTodos();
    renderTodos();
    taskInput.value = "";
    taskInput.focus();
}

function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(todos));
    updateItemsCount();
    checkEmptyState();
}

function updateItemsCount() {
    const uncompletedTodos = todos.filter((todo) => !todo.completed);
    itemsLeft.textContent = `${uncompletedTodos.length} item${uncompletedTodos.length !== 1 ? "s" : ""} left`;
}

function checkEmptyState() {
    const filteredTodos = filterTodos(currentFilter);
    if (filteredTodos.length === 0) {
        emptyState.classList.remove("hidden");
    } else {
        emptyState.classList.add("hidden");
    }
}

function filterTodos(filter) {
    switch (filter) {
        case "active":
            return todos.filter((todo) => !todo.completed);
        case "completed":
            return todos.filter((todo) => todo.completed);
        default:
            return todos;
    }
}

function renderTodos() {
    todosList.innerHTML = "";

    const filteredTodos = filterTodos(currentFilter);

    filteredTodos.forEach((todo) => {
        const todoItem = document.createElement("li");
        todoItem.classList.add("task-item");

        if (todo.completed) {
            todoItem.classList.add("completed");
        }

        const checkboxContainer = document.createElement("label");
        checkboxContainer.classList.add("checkbox-container");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("todo-checkbox");
        checkbox.checked = todo.completed;
        checkbox.addEventListener("change", () => toggleTodo(todo.id));

        const checkmark = document.createElement("span");
        checkmark.classList.add("checkmark");

        checkboxContainer.appendChild(checkbox);
        checkboxContainer.appendChild(checkmark);

        const todoText = document.createElement("span");
        todoText.classList.add("todo-item-text");
        todoText.textContent = todo.text;

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete");
        deleteBtn.innerHTML = '<i class="fa fa-times"></i>';
        deleteBtn.addEventListener("click", () => deleteTodo(todo.id));

        todoItem.appendChild(checkboxContainer);
        todoItem.appendChild(todoText);
        todoItem.appendChild(deleteBtn);

        todosList.appendChild(todoItem);
    });
}

function clearCompleted() {
    todos = todos.filter((todo) => !todo.completed);
    saveTodos();
    renderTodos();
}

function toggleTodo(id) {
    todos = todos.map((todo) => {
        if (todo.id === id) {
            return {...todo, completed: !todo.completed};
        }
        return todo;
    });
    saveTodos();
    renderTodos();
}

function deleteTodo(id) {
    todos = todos.filter((todo) => todo.id !== id);
    saveTodos();
    renderTodos();
}

// Инициализация приложения
init();