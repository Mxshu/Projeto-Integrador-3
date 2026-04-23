# Projeto Integrador 3

Este repositório contém o backend do Projeto Integrador 3 desenvolvido com FastAPI e SQLite.

## Tecnologias utilizadas

- Python 3
- FastAPI
- SQLite
- Uvicorn

## Como executar o projeto

1. Acesse a pasta do backend:

cd back-end

2. Ative o ambiente virtual:

Linux / WSL:

source venv/bin/activate

Windows:

venv\Scripts\activate.bat
ou
venv\Scripts\Activate.ps1

3. Execute o servidor:

uvicorn main:app --reload

4. Acesse no navegador:

API:
http://127.0.0.1:8000

Documentação interativa (Swagger):
http://127.0.0.1:8000/docs
