const taskContainer = document.getElementById("task-container");
const API_URL = "http://localhost:3000/todos";
const addTaskForm = document.getElementById("add-task")
const addBtn = document.getElementById("addBtn")
const addTaskBtn = document.getElementById("task-submit")
const titleInput = document.getElementById("task-title");
const descInput = document.getElementById("task-description");
const dateInput = document.getElementById("dueDate");
const editTaskForm = document.getElementById("edit-task");
const editTitleInput = document.getElementById("task-title-edit");
const editDescInput = document.getElementById("task-description-edit");
const editDateInput = document.getElementById("dueDate-edit");
const editTaskBtn = document.getElementById("edit-task-submit");
const categoryInput = document.getElementById("category");
const editCategoryInput = document.getElementById("task-category-edit");
const categoryFilter = document.getElementById("category-filter");

let currentEditTaskId = null;

addBtn.addEventListener("click", () => {
    addTaskForm.classList.remove("hide")
})

addTaskBtn.addEventListener("click", async () => {
    const newTask = {
        title: titleInput.value,
        description: descInput.value,
        due_date: dateInput.value,
        category: categoryInput.value,
        completed: false
    };
    await addTask(newTask);
    titleInput.value = "";
    descInput.value = "";
    dateInput.value = "";
    addTaskForm.classList.add("hide");
    getTasks(categoryFilter.value);
});

editTaskBtn.addEventListener("click", async () => {
    const updatedTask = {
        title: editTitleInput.value,
        description: editDescInput.value,
        category: editCategoryInput.value,
        due_date: editDateInput.value
    };
    await editTask(updatedTask);
    editTitleInput.value = "";
    editDescInput.value = "";
    editDateInput.value = "";
    currentEditTaskId = null;
    editTaskForm.classList.add("hide");
    getTasks(categoryFilter.value);
});

async function addTask(taskData) {
    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData)
    });
    getTasks(categoryFilter.value);
}

async function editTask(taskData) {
    if (!currentEditTaskId) return;
    await fetch(`${API_URL}/${currentEditTaskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData)
    });
    getTasks(categoryFilter.value);
}

const getTasks = async (category = '') => {
    try {
        let url = API_URL;
        if (category) url += `?category=${category}`;
        const res = await fetch(url);
        const tasks = await res.json();
        taskContainer.innerHTML = "";
        tasks.forEach(task => {
            const taskItem = createTask(task);
            taskContainer.appendChild(taskItem);
        });
    } catch (err) {
        console.error("Error fetching tasks:", err);
    }
};

categoryFilter.addEventListener("change", () => {
    const selectedCategory = categoryFilter.value;
    getTasks(selectedCategory);
});

async function toggleComplete(task) {
    await fetch(`${API_URL}/${task.id}`, {
        method: "PATCH",
        body: JSON.stringify({ completed: !task.completed })
    });
    getTasks(categoryFilter.value);
}

async function deleteTask(task) {
    await fetch(`${API_URL}/${task.id}`, { method: "DELETE" });
    getTasks(categoryFilter.value);
}

function createTask(task) {
    const wrapper = document.createElement("div");
    const taskDiv = document.createElement("div");
    taskDiv.className = "task";
    if (task.completed) taskDiv.classList.add("completed");

    const left = document.createElement("div");
    left.className = "left";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => toggleComplete(task));

    const description = document.createElement("div");
    description.className = "description";

    const title = document.createElement("h2");
    title.textContent = task.title;

    const desc = document.createElement("p");
    desc.textContent = task.description;

    const dueDate = document.createElement("div");
    dueDate.className = "dueDate";
    const calendarImg = document.createElement("img");
    calendarImg.src = "./images/calendar.png";
    const dateText = document.createElement("p");
    dateText.textContent = task.due_date;
    dueDate.append(calendarImg, dateText);

    const infoDiv = document.createElement("div");
    infoDiv.className = "info-row";

    const categoryDiv = document.createElement("div");
    categoryDiv.className = "category";
    const labelImg = document.createElement("img");
    labelImg.src = "./images/label.png";
    const categoryText = document.createElement("p");
    categoryText.textContent = task.category;
    categoryDiv.append(labelImg, categoryText);

    infoDiv.append(dueDate, categoryDiv);
    description.append(title, desc, infoDiv);
    left.append(checkbox, description);

    const right = document.createElement("div");
    right.className = "right";
    const editImg = document.createElement("img");
    editImg.src = "./images/edit.png";
    editImg.addEventListener("click", () => {
        currentEditTaskId = task.id;
        editTitleInput.value = task.title;
        editDescInput.value = task.description;
        editDateInput.value = task.due_date;
        editCategoryInput.value = task.category;
        editTaskForm.classList.remove("hide");
    });

    const deleteImg = document.createElement("img");
    deleteImg.src = "./images/delete.png";
    deleteImg.addEventListener('click', () => deleteTask(task));

    right.append(editImg, deleteImg);
    taskDiv.append(left, right);
    wrapper.appendChild(taskDiv);

    return wrapper;
}

getTasks();
