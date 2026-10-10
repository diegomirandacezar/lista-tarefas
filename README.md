# TaskFlow - Gestão Inteligente de Tarefas com Supabase Auth

Aplicativo web moderno, responsivo e de alta performance para gerenciamento e acompanhamento de tarefas diárias, com **sistema de autenticação integrado ao Supabase**, suporte a **múltiplos usuários com perfis exclusivos**, isolamento de tarefas via **Row Level Security (RLS)** e persistência em nuvem.

---

## 🚀 Principais Funcionalidades

### 🔐 Autenticação e Perfis (Supabase Auth)
- **Login com Email e Senha:** Acesso seguro com validação e mensagens amigáveis em português.
- **Criação de Conta (Cadastro):** Registro com nome completo, email e senha segura (mínimo de 6 caracteres).
- **Recuperação de Senha:** Envio de email com link seguro de recuperação e redefinição de nova senha.
- **Multiusuário com RLS:** Cada usuário autenticado possui seu próprio conjunto de tarefas no banco PostgreSQL, protegido no nível de banco de dados pelo Row Level Security.
- **Perfil do Usuário:**
  - Painel com iniciais estilizadas, nome de exibição editável, email e data de cadastro.
  - Indicadores e métricas de produtividade exclusivas do usuário logado.
  - Alteração direta de senha pelo perfil.
  - Logout seguro que encerra a sessão no Supabase.
- **Atalho de Teste Rápido:** Botão no formulário de login para preencher instantaneamente as credenciais do primeiro usuário já cadastrado.

### 📋 Gestão de Tarefas
- **CRUD Completo:** Criação, edição, visualização, conclusão e exclusão de tarefas com diálogo de confirmação.
- **Categorização Visual:** Categorias temáticas (*Trabalho*, *Pessoal*, *Estudos* e *Saúde*).
- **Gestão de Prioridades:** Níveis *Alta*, *Média* e *Baixa* com marcadores cromáticos.
- **Controle de Prazos:** Acompanhamento de datas de vencimento com alertas visuais para tarefas atrasadas, para hoje ou futuras.
- **Filtros e Busca Instantânea:**
  - Filtragem por status: *Todas*, *Pendentes* e *Concluídas*.
  - Busca textual em tempo real por título e descrição.
  - Filtro por categoria e prioridade.
- **Métricas e Produtividade (Aba Análises):** Dashboard com gráficos de distribuição e taxa de conclusão.
- **Visão em Calendário:** Visualização mensal dinâmica para agendamentos.

---

## 👤 Credenciais do Primeiro Usuário Cadastrado

Para teste e avaliação imediata, utilize o usuário já registrado e confirmado no Supabase:

- **Email:** `diegomirandacezar@gmail.com`
- **Senha:** `senai@2026`

*(A tela de login conta com o botão **"Preencher Dados do Usuário Cadastrado"** para preenchimento com 1 clique).*

---

## 🛠️ Tecnologias Utilizadas

- **React 19**
- **Vite 8**
- **Tailwind CSS v4**
- **@supabase/supabase-js** (Cliente oficial do Supabase para Auth e Database)
- **PostgreSQL** com Row Level Security (RLS)
- **Lucide React** (Ícones modernos)
- **Google Fonts** (Plus Jakarta Sans & Inter)

---

## 📋 Pré-requisitos

- **Node.js** (versão 18 ou superior)
- **npm** (versão 9 ou superior)

---

## 🔧 Instalação e Execução

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Variáveis de Ambiente (`.env`):**
   ```env
   VITE_SUPABASE_URL=https://ktdfyoimhxjwqarklwpu.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   Acesse no navegador: `http://localhost:5173/`.

4. **Build de produção:**
   ```bash
   npm run build
   ```

---

## 🗄️ Arquitetura do Banco de Dados no Supabase

### 1. Tabela `public.profiles`
Armazena os perfis de cada usuário, preenchidos automaticamente via gatilho na tabela `auth.users`:
```sql
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
```

### 2. Tabela `public.tasks` com RLS por Usuário
Cada tarefa possui uma chave estrangeira `user_id` vinculada a `auth.users(id)`:
```sql
ALTER TABLE public.tasks ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.tasks ALTER COLUMN user_id SET DEFAULT auth.uid();
```

Políticas de segurança aplicadas:
- **SELECT:** `auth.uid() = user_id`
- **INSERT:** `auth.uid() = user_id`
- **UPDATE:** `auth.uid() = user_id`
- **DELETE:** `auth.uid() = user_id`
