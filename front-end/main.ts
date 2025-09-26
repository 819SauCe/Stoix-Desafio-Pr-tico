type Task = {
  id: number;
  title: string;
  description: string;
  completed: 0 | 1;
  createdAt: string;
  updatedAt: string;
};

let CSRF_TOKEN = "";

async function getCsrf() {
  const res = await fetch("/api/csrf-token", { credentials: "same-origin" });
  const data = await res.json();
  CSRF_TOKEN = data.csrfToken;
}

async function fetchTasks() {
  const res = await fetch("/api/tasks");
  const tasks: Task[] = await res.json();
  renderList(tasks);
}

function renderList(tasks: Task[]) {
  const list = document.getElementById("task-list") as HTMLUListElement;
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

function escapeHtml(s: string) {
  const div = document.createElement("div");
  div.innerText = s;
  return div.innerHTML;
}

async function createTask(title: string, description: string) {
  await fetch("/api/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": CSRF_TOKEN
    },
    body: JSON.stringify({ title, description })
  });
}

async function updateTask(id: number, patch: Partial<Task>) {
  await fetch(`/api/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": CSRF_TOKEN
    },
    body: JSON.stringify(patch)
  });
}

async function deleteTask(id: number) {
  await fetch(`/api/tasks/${id}`, {
    method: "DELETE",
    headers: { "X-CSRF-Token": CSRF_TOKEN }
  });
}

function bindEvents() {
  const form = document.getElementById("new-task") as HTMLFormElement;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = (document.getElementById("title") as HTMLInputElement).value.trim();
    const description = (document.getElementById("description") as HTMLInputElement).value.trim();
    if (!title) return alert("Título é obrigatório");
    await createTask(title, description);
    (document.getElementById("title") as HTMLInputElement).value = "";
    (document.getElementById("description") as HTMLInputElement).value = "";
    await fetchTasks();
    await getCsrf(); // renova token
  });

  const list = document.getElementById("task-list") as HTMLUListElement;
  list.addEventListener("click", async (e) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains("delete")) {
      const id = Number(target.getAttribute("data-id"));
      await deleteTask(id);
      await fetchTasks();
      await getCsrf();
    }
    if (target.classList.contains("edit")) {
      const id = Number(target.getAttribute("data-id"));
      const newTitle = prompt("Novo título:");
      if (newTitle === null) return;
      const newDesc = prompt("Nova descrição:") ?? "";
      await updateTask(id, { title: newTitle, description: newDesc as any });
      await fetchTasks();
      await getCsrf();
    }
  });

  list.addEventListener("change", async (e) => {
    const target = e.target as HTMLInputElement;
    if (target.classList.contains("toggle")) {
      const id = Number(target.getAttribute("data-id"));
      await updateTask(id, { completed: target.checked ? 1 : 0 } as any);
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
