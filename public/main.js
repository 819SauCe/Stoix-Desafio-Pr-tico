"use strict";
let CSRF_TOKEN = "";
async function getCsrf() {
    const res = await fetch("/api/csrf-token", { credentials: "same-origin" });
    const data = await res.json();
    CSRF_TOKEN = data.csrfToken;
}
async function fetchTasks() {
    const res = await fetch("/api/tasks");
    const tasks = await res.json();
    renderList(tasks);
}
function renderList(tasks) {
    const list = document.getElementById("task-list");
    list.innerHTML = "";
    for (const t of tasks) {
        const li = document.createElement("li");
        li.className = "task";
        li.innerHTML = `
      <label class="checkbox">
        <input type="checkbox" ${t.completed ? "checked" : ""} data-id="${t.id}" class="toggle"/>
        <span></span>
      </label>
      <div class="task-body">
        <strong>${escapeHtml(t.title)}</strong>
        <small>${escapeHtml(t.description || "")}</small>
      </div>
      <div class="actions">
        <button data-id="${t.id}" class="edit">Editar</button>
        <button data-id="${t.id}" class="delete">Excluir</button>
      </div>
    `;
        list.appendChild(li);
    }
}
function escapeHtml(s) {
    const div = document.createElement("div");
    div.innerText = s;
    return div.innerHTML;
}
async function createTask(title, description) {
    await fetch("/api/tasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": CSRF_TOKEN
        },
        body: JSON.stringify({ title, description })
    });
}
async function updateTask(id, patch) {
    await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": CSRF_TOKEN
        },
        body: JSON.stringify(patch)
    });
}
async function deleteTask(id) {
    await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
        headers: { "X-CSRF-Token": CSRF_TOKEN }
    });
}
function bindEvents() {
    const form = document.getElementById("new-task");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const title = document.getElementById("title").value.trim();
        const description = document.getElementById("description").value.trim();
        if (!title)
            return alert("Título é obrigatório");
        await createTask(title, description);
        document.getElementById("title").value = "";
        document.getElementById("description").value = "";
        await fetchTasks();
        await getCsrf(); // renova token
    });
    const list = document.getElementById("task-list");
    list.addEventListener("click", async (e) => {
        const target = e.target;
        if (target.classList.contains("delete")) {
            const id = Number(target.getAttribute("data-id"));
            await deleteTask(id);
            await fetchTasks();
            await getCsrf();
        }
        if (target.classList.contains("edit")) {
            const id = Number(target.getAttribute("data-id"));
            const newTitle = prompt("Novo título:");
            if (newTitle === null)
                return;
            const newDesc = prompt("Nova descrição:") ?? "";
            await updateTask(id, { title: newTitle, description: newDesc });
            await fetchTasks();
            await getCsrf();
        }
    });
    list.addEventListener("change", async (e) => {
        const target = e.target;
        if (target.classList.contains("toggle")) {
            const id = Number(target.getAttribute("data-id"));
            await updateTask(id, { completed: target.checked ? 1 : 0 });
            await fetchTasks();
            await getCsrf();
        }
    });
}
async function boot() {
    await getCsrf();
    await fetchTasks();
    bindEvents();
}
boot();
