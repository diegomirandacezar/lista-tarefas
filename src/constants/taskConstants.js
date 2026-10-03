export const CATEGORIES = {
  TRABALHO: {
    id: 'Trabalho',
    label: 'TRABALHO',
    display: 'Trabalho',
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    accent: '#4F46E5',
    dot: 'bg-indigo-500'
  },
  PESSOAL: {
    id: 'Pessoal',
    label: 'PESSOAL',
    display: 'Pessoal',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    accent: '#059669',
    dot: 'bg-emerald-500'
  },
  ESTUDOS: {
    id: 'Estudos',
    label: 'ESTUDOS',
    display: 'Estudos',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    accent: '#D97706',
    dot: 'bg-amber-500'
  },
  SAUDE: {
    id: 'Saúde',
    label: 'SAÚDE',
    display: 'Saúde',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    badge: 'bg-purple-50 text-purple-700 border-purple-200',
    accent: '#9333EA',
    dot: 'bg-purple-500'
  }
};

export const PRIORITIES = {
  ALTA: {
    id: 'Alta',
    label: 'ALTA',
    display: 'Alta',
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
    dot: 'bg-rose-500',
    weight: 3
  },
  MEDIA: {
    id: 'Média',
    label: 'MÉDIA',
    display: 'Média',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
    weight: 2
  },
  BAIXA: {
    id: 'Baixa',
    label: 'BAIXA',
    display: 'Baixa',
    badge: 'bg-sky-50 text-sky-700 border-sky-200',
    dot: 'bg-sky-500',
    weight: 1
  }
};

export const INITIAL_TASKS = [
  {
    id: 'task-1',
    title: 'Planejar sprint do novo projeto web',
    description: 'Definir backlog de requisitos, cronograma e divisão de tarefas da equipe.',
    category: 'Trabalho',
    priority: 'Alta',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // amanhã
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-2',
    title: 'Estudar arquitetura de microsserviços e Supabase',
    description: 'Revisar documentação de autenticação e Row Level Security (RLS).',
    category: 'Estudos',
    priority: 'Média',
    dueDate: new Date(Date.now() + 172800000).toISOString().split('T')[0], // 2 dias
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-3',
    title: 'Consulta médica preventiva anual',
    description: 'Exames de rotina no laboratório central às 09:00.',
    category: 'Saúde',
    priority: 'Alta',
    dueDate: new Date(Date.now() + 259200000).toISOString().split('T')[0], // 3 dias
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-4',
    title: 'Comprar mantimentos para a semana',
    description: 'Frutas, vegetais, grãos integrais e itens de limpeza.',
    category: 'Pessoal',
    priority: 'Baixa',
    dueDate: new Date().toISOString().split('T')[0], // hoje
    completed: true,
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];
