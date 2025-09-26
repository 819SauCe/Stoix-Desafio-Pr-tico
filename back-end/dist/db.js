import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
const dbPath = path.join(process.cwd(), "data");
if (!fs.existsSync(dbPath))
    fs.mkdirSync(dbPath, { recursive: true });
export const db = new Database(path.join(dbPath, "tasks.db"));
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    completed INTEGER NOT NULL DEFAULT 0,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );
`);
