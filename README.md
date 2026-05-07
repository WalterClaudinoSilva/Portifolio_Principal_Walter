# Walter Claudino | Portfólio Profissional

![Status](https://img.shields.io/badge/Status-Em_Desenvolvimento-blue)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![Prisma](https://img.shields.io/badge/Prisma-6-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC)

Este é um projeto de portfólio de alta performance e design premium, desenvolvido para apresentar trajetórias profissionais, projetos e habilidades técnicas com uma experiência de usuário imersiva e dinâmica.

## 🚀 Funcionalidades Principais

- **Sistema de Temas Sazonais Inteligentes**: O site altera automaticamente sua identidade visual e efeitos baseado na data atual (Natal, Ano Novo, Carnaval, Páscoa, Halloween, etc.).
- **Efeitos Visuais Dinâmicos**: Partículas temáticas (neve, sombrinhas de frevo, estrelas) utilizando **Framer Motion** para uma navegação fluida.
- **Painel Administrativo Completo**: Interface protegida para gestão de perfil, experiências, projetos e configurações de eventos sazonais.
- **Gestão de Mídia Inteligente**: Sistema de upload com limpeza automática de arquivos antigos no servidor e geração de nomes únicos (UUID).
- **Design Responsivo & Premium**: Layout moderno com estética *Glassmorphism* e suporte a múltiplos esquemas de cores.

## 🛠️ Tecnologias Utilizadas

- **Frontend**: Next.js 15 (App Router), Tailwind CSS, Framer Motion, Lucide React.
- **Backend**: Next.js API Routes, NextAuth.js para autenticação segura.
- **Banco de Dados**: Prisma ORM com suporte a SQLite/PostgreSQL.
- **Feedback**: React-Toastify para notificações em tempo real.

## ⚙️ Configuração Local

1. Clone o repositório.
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure as variáveis de ambiente no arquivo `.env` (baseie-se no `.env.example`).
4. Execute as migrações do banco de dados:
   ```bash
   npx prisma migrate dev
   ```
5. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

---

## 👨‍💻 Desenvolvedor

Este projeto foi idealizado e desenvolvido integralmente por:
**Walter Claudino da Silva Júnior**

---
© 2026 Walter Claudino. Todos os direitos reservados.
