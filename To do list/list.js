let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
let currentFilter = "all";

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.style.display = "block";
  setTimeout(() => (toast.style.display = "none"), 2000);
}

function renderTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  let filtered = tasks;
  if (currentFilter === "active") filtered = tasks.filter(t => !t.completed);
  if (currentFilter === "completed") {
    filtered = tasks.filter(t => t.completed);
  }
  

  filtered.forEach((task) => {
    const li = document.createElement("li");
    li.className = `${task.completed ? "completed" : ""} ${task.priority}`;
    li.setAttribute("data-id", task.id);

    const span = document.createElement("span");
    span.textContent = task.text;
    span.onclick = () => toggleComplete(task.id);
    li.appendChild(span);

    const actions = document.createElement("div");
    actions.className = "actions";

    const editBtn = document.createElement("i");
    editBtn.className = "fas fa-pen";
    editBtn.onclick = () => editTask(task.id);

    const delBtn = document.createElement("i");
    delBtn.className = "fas fa-trash";
    delBtn.onclick = () => deleteTask(task.id);

    actions.appendChild(editBtn);
    actions.appendChild(delBtn);
    li.appendChild(actions);

    list.appendChild(li);
  });

  document.getElementById("progressSummary").textContent = `✔️ ${tasks.filter(t => t.completed).length} of ${tasks.length} tasks completed`;
  enableDrag();
}

function addTask() {
  const input = document.getElementById("taskInput");
  const priority = document.getElementById("prioritySelect").value;
  const text = input.value.trim();
  if (!text) return;

  const task = {
    id: Date.now(),
    text,
    completed: false,
    priority,
    completedAt: null
  };
  tasks.push(task);
  saveTasks();
  renderTasks();
  showToast("Task added!");
  input.value = "";
}

function toggleComplete(id) {
  const index = tasks.findIndex(t => t.id === id);
  if (index !== -1) {
    tasks[index].completed = !tasks[index].completed;
    tasks[index].completedAt = tasks[index].completed ? Date.now() : null;
    saveTasks();
    renderTasks();
  }
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
  showToast("Task deleted!");
}

function editTask(id) {
  const index = tasks.findIndex(t => t.id === id);
  const newText = prompt("Edit task:", tasks[index].text);
  if (newText !== null) {
    tasks[index].text = newText.trim();
    saveTasks();
    renderTasks();
  }
}

function filterTasks(filter) {
  currentFilter = filter;
  renderTasks();
}

document.getElementById("toggleDarkMode").onclick = () => {
  document.body.classList.toggle("dark");
};

function enableDrag() {
  new Sortable(document.getElementById("taskList"), {
    animation: 150,
    onEnd: function (e) {
      const movedItem = tasks.splice(e.oldIndex, 1)[0];
      tasks.splice(e.newIndex, 0, movedItem);
      saveTasks();
      renderTasks();
    }
  });
}

window.onload = renderTasks;
