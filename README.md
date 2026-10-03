# TaskFlow - Gestão Inteligente de Tarefas

Aplicativo web moderno, responsivo e de alta performance para gerenciamento e acompanhamento de tarefas diárias, com suporte a persistência local (LocalStorage) e integração em tempo real com **Supabase**.

---

## 🚀 Principais Funcionalidades

- **CRUD Completo:** Criação, edição, visualização, conclusão e exclusão de tarefas com diálogo de confirmação.
- **Categorização Visual:** Categorias temáticas (*Trabalho*, *Pessoal*, *Estudos* e *Saúde*) com identidade visual dedicada.
- **Gestão de Prioridades:** Níveis *Alta*, *Média* e *Baixa* com marcadores cromáticos.
- **Controle de Prazos:** Acompanhamento de datas de vencimento com alertas visuais para tarefas atrasadas, para hoje ou futuras.
- **Filtros e Busca Instantânea:**
  - Filtragem por status: *Todas*, *Pendentes* e *Concluídas*.
  - Busca textual em tempo real por título e descrição.
  - Filtro por categoria e prioridade.
- **Métricas e Produtividade (Aba Análises):** Dashboard com taxa de conclusão e gráficos de distribuição por categoria e nível de prioridade.
- **Visão em Calendário:** Visualização mensal dinâmica para acompanhamento de tarefas por dia.
- **Persistência Híbrida / Desacoplada:**
  - **Supabase:** Armazenamento em banco de dados relacional PostgreSQL em nuvem.
  - **LocalStorage:** Fallback automático transparente caso as credenciais da nuvem não estejam configuradas.

---

## 🛠️ Tecnologias Utilizadas

- **React 19**
- **Vite 8**
- **Tailwind CSS v4**
- **@supabase/supabase-js** (Cliente oficial do Supabase)
- **Lucide React** (Ícones modernos)
- **Google Fonts** (Plus Jakarta Sans & Inter)

---

## 📋 Pré-requisitos

- **Node.js** (versão 18 ou superior)
- **npm** (versão 9 ou superior)

---

## 🔧 Instalação e Configuração

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/diegomirandacezar/lista-tarefas.git
   cd lista-tarefas
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as Variáveis de Ambiente:**
   Copie o arquivo de exemplo para criar seu `.env`:
   ```bash
   cp .env.example .env
   ```
   Preencha com os dados do seu projeto no Supabase:
   ```env
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-publica-anonima
   ```
   *(Nota: Se o `.env` não for preenchido, o sistema funcionará normalmente salvando dados localmente no navegador via LocalStorage).*

---

## 💻 Execução do Projeto

### Modo de Desenvolvimento
Inicie o servidor de desenvolvimento Vite:
```bash
npm run dev
```
Acesse a aplicação no navegador em: `http://localhost:5173/`.

### Geração de Build de Produção
Para compilar os arquivos otimizados para produção:
```bash
npm run build
```
Os artefatos compilados serão gerados na pasta `dist/`.

### Visualização do Build de Produção (Preview)
Para visualizar o build localmente antes da publicação:
```bash
npm run preview
```

---

## 📁 Estrutura do Projeto

```text
├── .docs/                    # Documentação e especificações do projeto
├── src/
│   ├── components/           # Componentes modulares da interface
│   │   ├── analytics/        # Gráficos e métricas de desempenho
│   │   ├── calendar/         # Visão de calendário e agendamentos
│   │   ├── common/           # Componentes reutilizáveis (Badge, Modal, etc.)
│   │   ├── layout/           # Barra de navegação e cabeçalhos
│   │   └── tasks/            # Listagem, cards, filtros e modais de tarefas
│   ├── constants/            # Cores, categorias e tarefas padrão
│   ├── hooks/                # Hook customizado useTasks
│   ├── services/             # Camada de abstração de dados (Supabase & LocalStorage)
│   ├── App.jsx               # Componente raiz da aplicação
│   ├── main.jsx              # Ponto de entrada React
│   └── index.css             # Folha de estilos global e Tailwind CSS
├── .env.example              # Modelo de variáveis de ambiente
├── .gitignore                # Regras de exclusão do controle de versão
├── index.html                # Documento HTML principal
├── package.json              # Manifesto do projeto e dependências
└── vite.config.js            # Configurações do empacotador Vite
```

---

## 🗄️ Estrutura da Tabela no Banco de Dados (Supabase)

Caso deseje criar a tabela manualmente em uma nova instância do Supabase:

```sql
create table if not exists public.tasks (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text default '',
  category text not null,
  priority text not null,
  due_date date not null,
  completed boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Ativar Row Level Security (RLS)
alter table public.tasks enable row level security;

-- Políticas de acesso público para demonstração
create policy "Permitir leitura pública de tarefas" on public.tasks for select to public using (true);
create policy "Permitir inserção pública de tarefas" on public.tasks for insert to public with check (true);
create policy "Permitir atualização pública de tarefas" on public.tasks for update to public using (true) with check (true);
create policy "Permitir exclusão pública de tarefas" on public.tasks for delete to public using (true);
```
