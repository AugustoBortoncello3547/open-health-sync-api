# Open Health Sync API

API REST para **sincronização de dados da saúde**, desenvolvida com [Fastify](https://fastify.dev/), [TypeScript](https://www.typescriptlang.org/) e [MongoDB](https://www.mongodb.com/).  
O objetivo é fornecer uma solução segura e escalável para integrar aplicações que precisam gerenciar **pacientes, ambientes e registros de saúde**.

Este projeto foi inicialmente desenvolvido como parte do meu **TCC (Trabalho de Conclusão de Curso) em Ciência da Computação**, surgindo a partir de um problema real identificado no sistema [DeepDataMD](https://deepdatamd.com/about). A ideia era criar uma API robusta que permitisse sincronizar dados de saúde de forma confiável, segura e facilmente integrável a diferentes aplicações, resolvendo lacunas de interoperabilidade encontradas no cenário real.

---

## 🚀 Tecnologias

- [Node](https://nodejs.org/pt) - Interpretador JavaScript
- [TypeScript](https://www.typescriptlang.org/) – Tipagem estática
- [Fastify](https://fastify.dev/) – Framework HTTP rápido e eficiente
- [Zod](https://zod.dev/) – Validação de esquemas
- [Mongoose](https://mongoosejs.com/) – ODM para MongoDB
- [JWT](https://jwt.io/) – Autenticação
- [Bcrypt](https://www.npmjs.com/package/bcrypt) – Hash de senhas
- [Vitest](https://vitest.dev/) – Testes unitários
- [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/) – Qualidade de código
- [Docker](https://docs.docker.com/) - Conteinerização, especialmente para o banco de dados

A lista completa de bibliotecas e plugins utilizados no projeto pode ser visualizado no arquivo **package.json** na reíz do projeto.

---

## 📂 Estrutura do Projeto

```
api/
 ├─ index.ts          # Serveless function para a Vercel
docs/                 # Documentos contendo informações sobre o desenvolvimento da API
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
 ├─ index.ts          # Ponto de entrada para DEV
 ├─ env.d.ts          # Tipagens globais
 └─ types.ts          # Tipagens para configuração da aplicaão
```

### ⚙️ Pontos importantes sobre a estrutura

**Execução na Vercel (Serverless):**  
 A Vercel utiliza **funções serverless**, portanto **não é possível iniciar um servidor ouvindo uma porta** (como `app.listen()`).  
 Em vez disso, criamos uma **função serverless exportada como `default`**, localizada em `api/index.ts`.

**Detecção automática:**  
 A Vercel identifica automaticamente qualquer função dentro da pasta **`/api`** na raiz do projeto e a executa conforme as requisições.

**Ambiente de desenvolvimento:**  
 Para rodar localmente, utilizamos **`src/index.ts`**, que executa a aplicação de forma idêntica à função serverless — apenas com um método de inicialização diferente.

---

## ⚙️ Instalação e Uso

### 1. Clone o repositório

```bash
git clone https://github.com/AugustoBortoncello3547/open-health-sync-api.git
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

Todas as variáveis de ambiente que precisam ser configuradas estão no arquivo **.env.example** na raiz deste projeto devidamente documentadas.

### 🗄️ 4. Configurar o Banco de Dados de Desenvolvimento

Para que a API funcione corretamente em ambiente local, é necessário configurar uma instância do **MongoDB**.  
Existem duas formas de fazer isso:

---

#### 🚀 Opção 1: Usando Docker (recomendado)

Se você possui o **Docker** instalado, basta subir o banco de dados com o comando abaixo:

```bash
docker compose up -d
```

Isso irá iniciar um contêiner MongoDB configurado conforme o arquivo `docker-compose.yml`, criando um ambiente isolado e pronto para desenvolvimento.

> 💡 **Dica:** Após subir o container, você pode verificar se o banco está ativo com:
>
> ```bash
> docker ps
> ```
>
> O serviço do MongoDB deve aparecer como em execução.

---

#### ☁️ Opção 2: Usando o MongoDB Atlas (nuvem)

Caso prefira utilizar o **MongoDB Atlas** (serviço em nuvem), basta configurar a URL de conexão diretamente no arquivo `.env`:

```bash
MONGODB_URI=mongodb+srv://<usuario>:<senha>@<cluster>/<nome-do-banco>
```

A aplicação utilizará automaticamente essa conexão ao iniciar.

> ⚠️ **Importante:** Certifique-se de que o IP local está liberado no painel do Atlas ou configure o acesso para `0.0.0.0/0` (apenas para testes locais).

Para criar um banco de dados no Atlas, poderá seguir essa documentação simples: https://www.mongodb.com/pt-br/resources/products/fundamentals/create-database

---

💬 **Resumo:**

- Use **Docker** se quiser um ambiente local rápido e controlado.
- Use **Atlas** se preferir uma conexão remota sem precisar manter o banco localmente.

### 5. Rodar em desenvolvimento

```bash
npm run dev
```

### 6. Build de produção

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

Isso irá gerar uma pasta **/coverage** na raíz do projeto com os dados dos testes

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

### ⚙️ Extra: Collection pronta para testes

Para facilitar o uso e teste da API, este repositório inclui uma **coleção Postman** completa com todos os endpoints configurados.

Você pode importar diretamente no Postman o arquivo localizado em:

📁 [`/docs/Open Health Sync API.postman_collection.json`](./docs/Open%20Health%20Sync%20API.postman_collection.json)

> 💡 **Dica:** No Postman, vá em  
> `File → Import → Upload Files` e selecione o arquivo acima para carregar automaticamente todas as rotas e exemplos configurados.

## 🔒 Autenticação

A API utiliza o modelo de autenticação **JWT Bearer Token**.  
Para acessar as rotas protegidas, inclua o token no cabeçalho (header) das requisições:

```http
Authorization: Bearer <seu_token>
```

---

### 🔹 Rotas protegidas

Todas as rotas da API exigem autenticação via **JWT**, **exceto a rota de criação de aplicações** (`POST /v1/aplicacao`).  
Essa exceção existe para permitir o registro inicial de novas aplicações na plataforma.

---

### 🧩 Controle interno de acesso (admin-auth-hook)

Para cenários onde é necessário um **controle mais restrito sobre quem pode criar ou gerenciar aplicações**, foi implementado um **hook de autenticação administrativa**.

📁 **Localização:**  
`/src/hooks/admin-auth-hook.ts`

Esse hook (`adminAuthHook`) pode ser adicionado como **pre-handler** em rotas que demandam maior segurança.  
Exemplo de uso no registro da rota:

```ts
fastify.route({
  method: "POST",
  url: "/v1/aplicacao",
  preHandler: [adminAuthHook],
  handler: createAplicacaoHandler,
});
```

---

### ⚙️ Configuração

Defina no arquivo `.env` a variável que identifica a **aplicação mestre** (autorizada a gerenciar outras):

```bash
ADMIN_APP_ID=<id_da_aplicacao_mestre>
```

Essa aplicação funciona como uma “**aplicação principal**” com permissões administrativas.  
Ela será a única autorizada a criar e gerenciar outras aplicações.

> 💡 **Dica:**  
> A primeira aplicação (mestre) pode ser criada de duas formas:
>
> - Inserindo os dados manualmente no banco de dados.
> - Temporariamente desativando a validação e criando-a via Postman.

---

## 📌 Roadmap

- [x] Autenticação JWT
- [x] CRUD de Aplicações
- [x] CRUD de Ambientes
- [x] CRUD de Pacientes
- [x] CRUD de Registros de saúde

---

## ⚙️ Comandos extras

Abaixo estão alguns **comandos úteis** para manter o código limpo e padronizado:

```bash
# Verifica erros de lint em todos os arquivos TypeScript e JavaScript
npm run lint

# Corrige automaticamente problemas de lint, quando possível
npm run lint:fix

# Formata todo o código do projeto usando Prettier
npm run format
```

> 💡 **Dica:** Use o lint antes de commitar seu código para garantir que está seguindo as regras de estilo e qualidade definidas.

---

## 🌐 Deploy e Acesso

O deploy deste projeto foi feito na **[Vercel](https://vercel.com/)** e a documentação interativa da API pode ser acessada pelo seguinte link:

🔗 [https://open-health-sync-api.vercel.app/docs](https://open-health-sync-api.vercel.app/docs)

---

### ⚠️ Observações sobre acesso externo

Devido às **políticas de segurança da Vercel**, o acesso ao banco de dados diretamente de clientes externos (como Postman, navegador ou outros aplicativos) **provavelmente não funcionará**.

Isso acontece porque a Vercel bloqueia requisições diretas externas ao banco para proteger os dados, permitindo apenas que a aplicação serverless gerencie essas conexões internamente.

---

### 💡 Dica para testes locais

Para testar a API de forma completa, incluindo acesso ao banco de dados, recomenda-se rodar o projeto **localmente** usando Docker ou uma instância do MongoDB Atlas configurada em seu `.env`, previamente explicado.
Dessa forma, você poderá enviar requisições externas sem restrições.
