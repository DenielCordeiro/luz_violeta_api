# Luz Violeta Macramês - API Backend 🔮✨

Este é o repositório backend que alimenta a plataforma **Luz Violeta Macramês** (e-commerce e portfólio de peças artesanais). Desenvolvi esta API com o objetivo de demonstrar a aplicação prática de uma arquitetura modular, segura e integrada com serviços em nuvem.

O projeto está na fase final de construção.

---

## 🛠️ Stack Tecnológica

* **Ambiente de Execução:** Node.js
* **Linguagem:** JavaScript (ES6+)
* **Framework Principal:** Express (Gerenciamento de rotas e requisições HTTP)
* **Banco de Dados:** MongoDB
* **Modelagem de Dados (ODM):** Mongoose

---

## 📂 Arquitetura do Projeto

Para garantir a legibilidade do código e uma fácil manutenção, estruturei o diretório `src/` dividindo as responsabilidades de forma clara:

* `apis/` - Onde ficam concentrados os endpoints estruturados da aplicação.
* `config/` - Parâmetros de infraestrutura, como conexões de banco de dados e chaves de serviços.
* `controllers/` - Intermediação entre as requisições HTTP e as regras de negócio.
* `middlewares/` - Camada de segurança e tratamentos intermediários (ex: validações).
* `models/` - Definição de schemas e validação estrutural do MongoDB via Mongoose.
* `services/` - Onde reside toda a regra de negócio e integrações externas.

---

## 🔒 Destaques Técnicos

### 1. Criptografia e Autenticação
Segurança em primeiro lugar. Para o gerenciamento de credenciais de usuários, utilizei a biblioteca **bcrypt**. Nenhuma senha é guardada em formato limpo no banco de dados; todas passam por processos de *salting* e hashing seguro antes da persistência.

### 2. Armazenamento de Mídias em Nuvem
Para o gerenciamento e exibição das fotos dos macramês, integrei o backend diretamente com o **Firebase Storage**. A API recebe os arquivos, realiza o upload assíncrono para os buckets da nuvem e armazena os links públicos estruturados no MongoDB, otimizando o consumo de armazenamento do servidor.

---

Desenvolvido por **Deniel Cordeiro** 🚀
