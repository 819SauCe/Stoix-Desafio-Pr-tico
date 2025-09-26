import { db } from "./db.js";

export type Task = {
  id: number;
  title: string;
  description: string;
  completed: number; // 0/1
  createdAt: string;
  updatedAt: string;
};

const insertStmt = db.prepare(
  `INSERT INTO tasks (title, description, completed, createdAt, updatedAt)
   VALUES (@title, @description, @completed, @createdAt, @updatedAt)`
);
const listStmt = db.prepare(`SELECT * FROM tasks ORDER BY createdAt DESC`);
const getStmt = db.prepare(`SELECT * FROM tasks WHERE id = ?`);
const updateStmt = db.prepare(
  `UPDATE tasks SET title=@title, description=@description, completed=@completed, updatedAt=@updatedAt WHERE id=@id`
);
const deleteStmt = db.prepare(`DELETE FROM tasks WHERE id = ?`);

export function createTask(input: { title: string; description?: string; }): Task {
  const now = new Date().toISOString();
  const info = insertStmt.run({
    title: input.title.trim(),
    description: input.description?.trim() ?? "",
    completed: 0,
    createdAt: now,
    updatedAt: now
  });
  return getStmt.get(info.lastInsertRowid as number) as Task;
}

export function listTasks(): Task[] {
  return listStmt.all() as Task[];
}

export function updateTask(id: number, patch: Partial<Omit<Task, "id">>): Task | null {
  const current = getStmt.get(id) as Task | undefined;
  if (!current) return null;
  const updated = {
    id,
    title: patch.title?.trim() ?? current.title,
    description: patch.description?.trim() ?? current.description,
    completed: typeof patch.completed === "number" ? patch.completed : current.completed,
    updatedAt: new Date().toISOString()
  };
  updateStmt.run(updated);
  return getStmt.get(id) as Task;
}

export function deleteTask(id: number): boolean {
  const info = deleteStmt.run(id);
  return info.changes > 0;
}
