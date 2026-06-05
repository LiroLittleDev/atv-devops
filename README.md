# 📦 atv-devops — API de Upload com MinIO

API REST em Node.js para **upload e listagem de arquivos**, utilizando o [MinIO](https://min.io/) como storage de objetos (compatível com S3). O ambiente do MinIO é provisionado via Docker Compose.

---

## 🗂️ Estrutura do Projeto

```
atv-devops/
├── src/
│   ├── index.js          # Servidor Express com as rotas da API
│   └── minioClient.js    # Configuração e instância do cliente MinIO
├── .env                  # Variáveis de ambiente (NÃO versionar em produção!)
├── .gitignore
├── docker-compose.yml    # Sobe o serviço MinIO via Docker
├── package.json
└── package-lock.json
```

---

## ✅ Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) v18 ou superior
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/)
- [Git](https://git-scm.com/)

---

## 🚀 Instalação e Execução

### 1. Clone o repositório

```bash
git clone https://github.com/LiroLittleDev/atv-devops.git
cd atv-devops
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie (ou edite) o arquivo `.env` na raiz do projeto:

```env
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=meu-bucket
```

> ⚠️ **Nunca versione o `.env` com credenciais reais em repositórios públicos!**

### 4. Suba o MinIO com Docker Compose

```bash
docker-compose up -d
```

Isso irá iniciar o MinIO com:
- **API S3:** `http://localhost:9000`
- **Console Web (UI):** `http://localhost:9001`
  - Usuário: `minioadmin`
  - Senha: `minioadmin`

### 5. Inicie a API

```bash
npm start
```

A API estará disponível em: `http://localhost:3000`

---

## 📡 Endpoints da API

### `POST /upload`

Faz o upload de um arquivo para o bucket MinIO.

**Content-Type:** `multipart/form-data`

| Campo | Tipo   | Descrição                  |
|-------|--------|----------------------------|
| file  | File   | Arquivo a ser enviado      |

**Exemplo com `curl`:**
```bash
curl -X POST http://localhost:3000/upload \
  -F "file=@/caminho/para/seu/arquivo.png"
```

**Resposta de sucesso (`200`):**
```json
{
  "message": "Upload realizado com sucesso",
  "filename": "arquivo.png"
}
```

**Resposta de erro (`400`):**
```json
{
  "error": "Envie um arquivo no campo file"
}
```

---

### `GET /files`

Lista todos os arquivos armazenados no bucket MinIO.

**Exemplo com `curl`:**
```bash
curl http://localhost:3000/files
```

**Resposta de sucesso (`200`):**
```json
[
  {
    "name": "arquivo.png",
    "size": 102400,
    "lastModified": "2026-06-05T21:00:00.000Z",
    "etag": "abc123..."
  }
]
```

---

## 🛑 Parando os serviços

Para parar o container do MinIO:

```bash
docker-compose down
```

Para parar e remover os volumes (apaga os dados armazenados):

```bash
docker-compose down -v
```

---

## 🔧 Scripts disponíveis

| Comando       | Descrição                        |
|---------------|----------------------------------|
| `npm start`   | Inicia a API em modo produção    |

---

## 📦 Dependências

| Pacote    | Versão   | Descrição                                  |
|-----------|----------|--------------------------------------------|
| express   | ^5.2.1   | Framework web para Node.js                 |
| multer    | ^2.1.1   | Middleware para upload de arquivos         |
| minio     | ^8.0.7   | Cliente oficial do MinIO (compatível S3)  |
| dotenv    | ^17.4.2  | Carrega variáveis de ambiente do `.env`   |

---

## ⚠️ Observações de Segurança

- Nunca suba o arquivo `.env` com credenciais reais para repositórios públicos.
- Em produção, utilize variáveis de ambiente do sistema ou um serviço de secrets (ex: GitHub Secrets, AWS Secrets Manager, Vault).
- Troque as credenciais padrão do MinIO (`minioadmin`/`minioadmin`) em ambientes expostos.
