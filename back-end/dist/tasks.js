import { db } from "./db.js";
const insertStmt = db.prepare(`INSERT INTO tasks (title, description, completed, createdAt, updatedAt)
   VALUES (@title, @description, @completed, @createdAt, @updatedAt)`);
const listStmt = db.prepare(`SELECT * FROM tasks ORDER BY createdAt DESC`);
const getStmt = db.prepare(`SELECT * FROM tasks WHERE id = ?`);
const updateStmt = db.prepare(`UPDATE tasks SET title=@title, description=@description, completed=@completed, updatedAt=@updatedAt WHERE id=@id`);
const deleteStmt = db.prepare(`DELETE FROM tasks WHERE id = ?`);
export function createTask(input) {
    const now = new Date().toISOString();
    const info = insertStmt.run({
        title: input.title.trim(),
        description: input.description?.trim() ?? "",
        completed: 0,
        createdAt: now,
        updatedAt: now
    });
    return getStmt.get(info.lastInsertRowid);
}
export function listTasks() {
    return listStmt.all();
}
export function updateTask(id, patch) {
    const current = getStmt.get(id);
    if (!current)
        return null;
    const updated = {
        id,
        title: patch.title?.trim() ?? current.title,
        description: patch.description?.trim() ?? current.description,
        completed: typeof patch.completed === "number" ? patch.completed : current.completed,
        updatedAt: new Date().toISOString()
    };
    updateStmt.run(updated);
    return getStmt.get(id);
}
export function deleteTask(id) {
    const info = deleteStmt.run(id);
    return info.changes > 0;
}
