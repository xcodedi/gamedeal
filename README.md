# 🎮 GAMEDEAL

### E-commerce de Itens e Serviços para Jogos

## 📌 Sobre o Projeto

O **GAMEDEAL** é uma plataforma de e-commerce voltada ao universo dos jogos eletrônicos, desenvolvida com o objetivo de conectar jogadores a produtos e serviços relacionados aos seus jogos favoritos.

A plataforma permite a comercialização de itens virtuais, como skins para jogos competitivos, além da oferta de serviços de mentoria para jogadores iniciantes que desejam aprimorar suas habilidades em diferentes jogos.

## 🎯 Objetivo

Desenvolver uma plataforma que facilite o acesso a produtos e serviços do universo gamer, proporcionando praticidade, variedade e uma experiência acessível para jogadores de diferentes níveis de experiência.

## 🛒 Funcionalidades e Serviços

- Venda de skins e itens virtuais para jogos.
- Oferta de mentorias para jogadores iniciantes.
- Suporte a diferentes jogos do cenário competitivo.
- Plataforma de visualização e aquisição de produtos e serviços.
- Autenticação de usuários.

## 💻 Tecnologias Utilizadas

### Frontend
- React Native
- Expo
- JavaScript / TypeScript

### Backend
- Serviços executados em containers.
- Docker e Docker Compose (conforme configuração do projeto).

## ⚙️ Pré-requisitos

Antes de iniciar o projeto, é necessário ter instalado:

- [Node.js](https://nodejs.org/)
- npm (instalado junto com o Node.js)
- [Git](https://git-scm.com/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Expo Go](https://expo.dev/go/) (para executar no celular)

## 🚀 Como executar o projeto

### 1. Clonar o repositório

Abra o terminal e execute:

```bash
git clone https://github.com/xcodedi/gamedeal.git
```

### 2. Acessar a pasta do projeto

```bash
cd gamedeal
```

### 3. Configurar e iniciar o Backend

Certifique-se de que o Docker Desktop esteja aberto e em execução.

Acesse a pasta onde está localizado o arquivo `docker-compose.yml` e execute:

```bash
docker compose up --build
```

Esse comando realiza a construção das imagens necessárias e inicia os containers configurados para o backend.

### 4. Configurar e iniciar o Frontend

Abra outro terminal, acesse a pasta do frontend e instale as dependências:

```bash
npm install
```

Após a instalação, inicie o projeto:

```bash
npx expo start
```

### 5. Acessar a aplicação

Após iniciar o Expo, será exibido um QR Code no terminal.

- **Celular:** abra o Expo Go e escaneie o QR Code.
- **Navegador:** utilize a opção de execução web disponibilizada pelo Expo.

Certifique-se de que o celular e o computador estejam conectados à mesma rede Wi-Fi, quando necessário.

## 🐳 Comandos úteis do Docker

Para visualizar os containers em execução:

```bash
docker ps
```

Para interromper os containers:

```bash
docker compose down
```

Para visualizar os logs:

```bash
docker compose logs
```

## 👥 Integrantes do Projeto

- Engenheiro de Qualidade: Ariel Chaves 1136093
- Líder: Diego Meira 1109435
- Gestor de Projeto: Eduardo Barreda 1138704
- Analista de Requisitos: João Vitor Buratti 1136821
- Desenvolvedor Backend: Kael Fuchs Zatti 1137819
- Desenvolvedor Frontend: Luis Eduardo 1134332
- Desenvolvedor Backend: Victor Quadri 1136643
- Design UX/UI: Vinicius Colussi 1137833

## 📚 Considerações Finais

O GAMEDEAL busca unir comércio digital e comunidade gamer em uma única plataforma, oferecendo produtos e serviços que atendam tanto jogadores interessados em personalização quanto aqueles que desejam evoluir e melhorar seu desempenho nos jogos.

---

**Projeto acadêmico desenvolvido em equipe.**
