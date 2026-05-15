# Projeto Integrador 3

Este repositório contém o **Projeto Integrador 3**, um projeto full-stack desenvolvido com um backend em FastAPI e SQLite, e um frontend em HTML, CSS e JavaScript.

## 📋 Visão Geral

O projeto é uma aplicação web completa que integra:
- **Backend**: API RESTful desenvolvida com FastAPI
- **Frontend**: Interface web responsiva com HTML, CSS e JavaScript
- **Banco de dados**: SQLite para persistência de dados

## 🛠️ Tecnologias Utilizadas

### Backend
- **Python 3**: Linguagem de programação principal
- **FastAPI**: Framework web moderno e de alto desempenho para construção de APIs REST
- **SQLite**: Banco de dados SQL leve e portátil
- **Uvicorn**: Servidor ASGI (Asynchronous Server Gateway Interface) para executar a aplicação

### Frontend
- **HTML 5**: Estrutura e semântica da página web
- **CSS 3**: Estilização e layout responsivo
- **JavaScript**: Interatividade e lógica do lado do cliente

## 📁 Estrutura do Projeto

```
Projeto-Integrador-3/
├── Back-end/              # Pasta do backend FastAPI
│   ├── venv/             # Ambiente virtual Python
│   ├── requirements.txt   # Dependências do projeto
│   ├── main.py           # Arquivo principal da aplicação FastAPI
│   └── ...               # Outros arquivos do backend
├── Front-end/            # Pasta do frontend
│   ├── index.html        # Página principal
│   ├── styles.css        # Estilos globais
│   ├── script.js         # Lógica JavaScript
│   └── ...               # Outros arquivos HTML, CSS e JS
└── README.md             # Este arquivo
```

## ⚙️ Configuração Inicial

### Pré-requisitos
- Python 3.8 ou superior
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Git (opcional, para clonar o repositório)

## 🚀 Como Executar o Projeto

### Backend

1. **Acesse a pasta do backend**:
   ```bash
   cd Back-end
   ```

2. **Ative o ambiente virtual**:
   
   **Linux / WSL**:
   ```bash
   source venv/bin/activate
   ```
   
   **Windows**:
   ```bash
   venv\Scripts\activate.bat
   ```
   ou
   ```bash
   venv\Scripts\Activate.ps1
   ```

3. **Instale as dependências**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Execute o servidor FastAPI**:
   ```bash
   uvicorn main:app --reload
   ```
   - O servidor rodará em `http://127.0.0.1:8000` por padrão
   - A flag `--reload` permite que o servidor reinicie automaticamente ao detectar mudanças no código

### Frontend

1. **Abra o arquivo no navegador**:
   - Navegue até a pasta `Front-end`
   - Abra o arquivo `index.html` no seu navegador web preferido
   - Ou use um servidor local (recomendado):
   ```bash
   # Usando Python 3
   python -m http.server 8001
   
   # Usando Node.js (se instalado)
   npx http-server
   ```

## 📚 Documentação da API

Após iniciar o servidor FastAPI, acesse:

- **API Base**: http://127.0.0.1:8000
- **Documentação Interativa (Swagger UI)**: http://127.0.0.1:8000/docs
- **Documentação Alternativa (ReDoc)**: http://127.0.0.1:8000/redoc

A documentação interativa permite testar os endpoints da API diretamente no navegador.

## 💻 Funcionalidades Principais

- API RESTful completa com endpoints para operações CRUD
- Interface web responsiva e intuitiva
- Integração entre frontend e backend via requisições HTTP (fetch/AJAX)
- Persistência de dados em banco de dados SQLite
- Validação de dados no backend com FastAPI
- Documentação automática da API

## 🔧 Desenvolvimento

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto (se necessário):
```
DATABASE_URL=sqlite:///./test.db
DEBUG=True
```

### Estrutura de Endpoints

Os endpoints da API seguem padrões RESTful:
- `GET /endpoint` - Obter dados
- `POST /endpoint` - Criar novo registro
- `PUT /endpoint/{id}` - Atualizar registro
- `DELETE /endpoint/{id}` - Deletar registro

### Comunicação Frontend-Backend

O frontend realiza requisições para o backend usando:
```javascript
fetch('http://127.0.0.1:8000/api/endpoint', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
})
```

## 📦 Dependências Principais

Veja o arquivo `Back-end/requirements.txt` para a lista completa de dependências Python.

Principais dependências:
- `fastapi` - Framework web
- `uvicorn` - Servidor ASGI
- `sqlalchemy` - ORM para banco de dados (se usado)
- `pydantic` - Validação de dados

## 🐛 Troubleshooting

**Problema**: Porta 8000 já em uso
```bash
# Use uma porta diferente
uvicorn main:app --reload --port 8001
```

**Problema**: Módulos Python não encontrados
```bash
# Certifique-se de ativar o ambiente virtual e reinstale as dependências
pip install -r requirements.txt
```

**Problema**: CORS (Cross-Origin) errors no frontend
- Adicione as configurações de CORS no FastAPI:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 📞 Suporte e Contribuições

Para reportar bugs ou sugerir melhorias, abra uma issue neste repositório.

## 📄 Licença

Este projeto foi desenvolvido como trabalho acadêmico.

---

**Última atualização**: 2026-05-15
