# Open Health Sync API

API REST para **sincronização de dados da saúde**, desenvolvida com [Fastify](https://fastify.dev/), [TypeScript](https://www.typescriptlang.org/) e [MongoDB](https://www.mongodb.com/).  
O objetivo é fornecer uma solução segura e escalável para integrar aplicações que precisam gerenciar **pacientes, ambientes e registros de saúde**.

---

## 🚀 Tecnologias

- [Fastify](https://fastify.dev/) – Framework HTTP rápido e eficiente
- [TypeScript](https://www.typescriptlang.org/) – Tipagem estática
- [Zod](https://zod.dev/) – Validação de esquemas
- [Mongoose](https://mongoosejs.com/) – ODM para MongoDB
- [JWT](https://jwt.io/) – Autenticação
- [Bcrypt](https://www.npmjs.com/package/bcrypt) – Hash de senhas
- [Vitest](https://vitest.dev/) – Testes unitários
- [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/) – Qualidade de código

---

## 📂 Estrutura do Projeto

```
src/
 ├─ controllers/      # Camada de controle (recebe requisições)
 ├─ database/         # Conexão e configuração do banco
 ├─ enums/            # Constantes e enums
 ├─ errors/           # Tratamento de erros customizados
 ├─ hooks/            # Middlewares e hooks globais
 ├─ models/           # Schemas do MongoDB
 ├─ repositories/     # Acesso a dados
 ├─ routes/           # Definição de rotas Fastify
 ├─ test/             # Testes unitários (Vitest)
 ├─ app.ts            # Configuração da aplicação
 ├─ index.ts          # Ponto de entrada
 └─ types.ts          # Tipagens globais
```

---

## ⚙️ Instalação e Uso

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/open-health-sync-api.git
cd open-health-sync-api
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure variáveis de ambiente

Crie um arquivo `.env` na raiz:

```env
JWT_SECRET=sua_chave_secreta
PORT=3000
```

Todas as variáveis de ambiente que precisam ser configuradas estão no arquivo **.env.example** na raiz deste projeto.

### 4. Rodar em desenvolvimento

```bash
npm run dev
```

### 5. Build de produção

```bash
npm run build
npm start
```

---

## 🧪 Testes

Executar os testes unitários:

```bash
npm test
```

Executar com cobertura:

```bash
npm run test:coverage
```

---

## 📖 Documentação da API

A API segue o padrão **OpenAPI 3.0**.  
A documentação interativa (Swagger UI) estará disponível em:

```
http://localhost:3000/docs
```

### Endpoints principais

- **Autenticação**
  - `POST /v1/auth` → Autentica e retorna JWT

- **Aplicação**
  - `POST /v1/aplicacao` → Criar aplicação
  - `GET /v1/aplicacao/{id}` → Consultar aplicação
  - `PUT /v1/aplicacao/{id}` → Atualizar aplicação

- **Ambiente**
  - `POST /v1/ambiente` → Criar ambiente
  - `GET /v1/ambiente` → Listar ambientes
  - `GET /v1/ambiente/{id}` → Consultar ambiente
  - `PUT /v1/ambiente/{id}` → Atualizar ambiente
  - `DELETE /v1/ambiente/{id}` → Excluir ambiente

- **Paciente**
  - `POST /v1/ambiente/{idAmbiente}/paciente` → Criar paciente
  - `GET /v1/ambiente/{idAmbiente}/paciente` → Listar pacientes
  - `GET /v1/ambiente/{idAmbiente}/paciente/{idPaciente}` → Consultar paciente
  - `PUT /v1/ambiente/{idAmbiente}/paciente/{idPaciente}` → Atualizar paciente
  - `DELETE /v1/ambiente/{idAmbiente}/paciente/{idPaciente}` → Excluir paciente

- **Registros de Saúde**
  - `POST /v1/paciente/{idPaciente}/registro` → Criar registro
  - `GET /v1/paciente/{idPaciente}/registro` → Listar registros
  - `GET /v1/paciente/{idPaciente}/registro/{idRegistro}` → Consultar registro
  - `PUT /v1/paciente/{idPaciente}/registro/{idRegistro}` → Atualizar registro
  - `DELETE /v1/paciente/{idPaciente}/registro/{idRegistro}` → Excluir registro

---

## 🔒 Autenticação

A API utiliza **JWT Bearer Token**.  
Inclua o token no header das requisições:

```http
Authorization: Bearer <seu_token>
```

---

## 🐳 Docker

Para rodar com Docker:

```bash
docker compose up -d
```

---

## 📌 Roadmap

- [x] Autenticação JWT
- [x] CRUD de Aplicações
- [x] CRUD de Ambientes
- [x] CRUD de Pacientes
- [x] CRUD de Registros de saúde
