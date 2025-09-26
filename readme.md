# Stoix - Desafio Prático

Sistema de gerenciamento de tarefas desenvolvido em TypeScript com Node.js, Express e SQLite.
O projeto inclui backend (API REST) e frontend simples em TypeScript, HTML e CSS.

---

## Tecnologias

- Backend:
  - Node.js + Express
  - TypeScript
  - Helmet
  - Cookie-Parser
  - CSRF (csurf)
  - SQLite (better-sqlite3)

- Frontend:
  - HTML e CSS
  - TypeScript compilado para JavaScript

---

## Estrutura do Projeto

```
stoix-todo/
├── back-end/
│ ├── src/
│ │ ├── server.ts # servidor Express e rotas
│ │ ├── tasks.ts # operações de CRUD no banco
│ │ └── db.ts # inicialização do banco SQLite
│ ├── dist/ # saída compilada do backend
│ ├── tsconfig.json
│ └── package.json
│
├── front-end/
│ ├── main.ts # código TypeScript do frontend
│ ├── tsconfig.json
│ └── public/
│ ├── index.html
│ ├── styles.css
│ └── main.js # gerado pelo compilador TypeScript
```


## Como executar

1. Instalar dependências (na pasta `back-end`):

```
npm install
```

2. Compilar o frontend:

```
npm run build:web
```

3. Compilar o backend:

```
npm run build:api
```

O servidor estará disponível em:
```
http://localhost:3000
```

## Banco de dados

- O projeto usa SQLite.
- O arquivo é criado automaticamente em back-end/data/tasks.db.
- Não é necessário configurar nem rodar banco externo.

## Endpoints da API

Obter CSRF Token:
```
GET /api/csrf-token
```

Resposta:

```
{
  "csrfToken": "token"
}
```

Listar tarefas:

```
GET /api/tasks
```

Criar tarefa

```
POST /api/tasks
Headers: X-CSRF-Token
Body:
{
  "title": "Título",
  "description": "Descrição opcional"
}
```

## Funcionalidades do Frontend

Criar nova tarefa
Listar tarefas existentes
Editar título e descrição
Marcar tarefa como concluída
Excluir tarefa

## Requisitos atendidos

Backend em TypeScript
CRUD completo
API RESTful
Persistência em banco de dados
Proteção contra CSRF
Frontend em TypeScript integrado ao backend
