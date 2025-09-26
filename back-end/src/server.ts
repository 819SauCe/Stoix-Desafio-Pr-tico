import express, { Request, Response, RequestHandler } from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import csurf from "csurf";
import path from "path";
import { createTask, listTasks, updateTask, deleteTask } from "./tasks.js";

declare global {
  namespace Express { interface Request { csrfToken(): string; } }
}

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cookieParser("super-secret-aqui-troque"));

const csrfProtection: RequestHandler = csurf({
  cookie: { httpOnly: true, sameSite: "lax", secure: false }
}) as unknown as RequestHandler;

const publicDir = path.join(process.cwd(), "../front-end/public");
app.use(express.static(publicDir));

app.get("/api/csrf-token", csrfProtection, (req: Request, res: Response) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.get("/api/tasks", (_req: Request, res: Response) => {
  res.json(listTasks());
});

app.post("/api/tasks", csrfProtection, (req: Request, res: Response) => {
  const { title, description } = req.body ?? {};
  if (!title || typeof title !== "string") {
    return res.status(400).json({ error: "title é obrigatório" });
  }
  const task = createTask({ title, description });
  res.status(201).json(task);
});

app.put("/api/tasks/:id", csrfProtection, (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "id inválido" });
  const { title, description, completed } = req.body ?? {};
  const comp = typeof completed === "boolean" ? (completed ? 1 : 0) : completed;
  const task = updateTask(id, { title, description, completed: comp });
  if (!task) return res.status(404).json({ error: "tarefa não encontrada" });
  res.json(task);
});

app.delete("/api/tasks/:id", csrfProtection, (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "id inválido" });
  const ok = deleteTask(id);
  if (!ok) return res.status(404).json({ error: "tarefa não encontrada" });
  res.status(204).send();
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server rodando em http://localhost:${PORT}`);
});
