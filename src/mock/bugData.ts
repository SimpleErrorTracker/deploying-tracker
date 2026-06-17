import type { Bug } from '@/types/bug.types'

// Начальные тестовые данные
export const allBugs: Bug[] = [
  {
    id: '1',
    description: 'Ошибка входа при использовании email',
    category: 'Authentication',
    priority: 'high',
    status: 'Open',
    created_at: '2026-06-01T10:00:00Z',
    author_id: 'u1',
    author_name: 'Петров А.',
  },
  {
    id: '2',
    description: 'Регистрация не работает с российскими доменами',
    category: 'Authentication',
    priority: 'critical',
    status: 'In Progress',
    created_at: '2026-06-02T14:30:00Z',
    author_id: 'u2',
    author_name: 'Смирнова Е.',
  },
  {
    id: '3',
    description: 'Восстановление пароля отправляет пустую ссылку',
    category: 'Authentication',
    priority: 'high',
    status: 'Open',
    created_at: '2026-06-03T09:15:00Z',
    author_id: 'u1',
    author_name: 'Петров А.',
  },
  {
    id: '4',
    description: 'JWT токен истекает слишком быстро',
    category: 'Authentication',
    priority: 'high',
    status: 'Done',
    created_at: '2026-06-04T16:45:00Z',
    author_id: 'u3',
    author_name: 'Козлов М.',
  },
  {
    id: '5',
    description: 'Ошибки прав доступа к админке',
    category: 'Authentication',
    priority: 'critical',
    status: 'Open',
    created_at: '2026-06-05T11:20:00Z',
    author_id: 'u2',
    author_name: 'Смирнова Е.',
  },
  {
    id: '6',
    description: 'Данные не сохраняются при конфликте сети',
    category: 'DB',
    priority: 'high',
    status: 'Open',
    created_at: '2026-06-01T12:00:00Z',
    author_id: 'u1',
    author_name: 'Петров А.',
  },
  {
    id: '7',
    description: 'SQL инъекция в поиске',
    category: 'DB',
    priority: 'critical',
    status: 'In Progress',
    created_at: '2026-06-02T10:30:00Z',
    author_id: 'u3',
    author_name: 'Козлов М.',
  },
  {
    id: '8',
    description: 'Кэширование работает некорректно',
    category: 'DB',
    priority: 'medium',
    status: 'Done',
    created_at: '2026-06-03T14:15:00Z',
    author_id: 'u2',
    author_name: 'Смирнова Е.',
  },
  {
    id: '9',
    description: 'Адаптивность ломается на iPhone',
    category: 'UI',
    priority: 'medium',
    status: 'Open',
    created_at: '2026-06-01T15:30:00Z',
    author_id: 'u2',
    author_name: 'Смирнова Е.',
  },
  {
    id: '10',
    description: 'Кнопка невидима на dark mode',
    category: 'UI',
    priority: 'high',
    status: 'In Progress',
    created_at: '2026-06-03T11:00:00Z',
    author_id: 'u1',
    author_name: 'Петров А.',
  },
  {
    id: '11',
    description: '401 ошибка при правильном токене',
    category: 'Network',
    priority: 'high',
    status: 'Open',
    created_at: '2026-06-02T16:00:00Z',
    author_id: 'u1',
    author_name: 'Петров А.',
  },
  {
    id: '12',
    description: 'Таймаут запроса к Supabase',
    category: 'Network',
    priority: 'critical',
    status: 'In Progress',
    created_at: '2026-06-04T11:45:00Z',
    author_id: 'u3',
    author_name: 'Козлов М.',
  },
]

export const generateAdditionalBugs = (): Bug[] => {
  const additional: Bug[] = []
  const categories = ['Authentication', 'DB', 'UI', 'Network'] as Bug['category'][]
  const priorities = ['low', 'medium', 'high', 'critical'] as Bug['priority'][]
  const statuses = ['Open', 'In Progress', 'Done'] as Bug['status'][]
  const authors = [
    { id: 'u1', name: 'Петров А.' },
    { id: 'u2', name: 'Смирнова Е.' },
    { id: 'u3', name: 'Козлов М.' },
  ]

  const startId = allBugs.length + 1
  for (let i = startId; i <= 88; i++) {
    const date = new Date('2026-06-01')
    date.setDate(date.getDate() + Math.floor(Math.random() * 7))
    date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60))

    additional.push({
      id: String(i),
      description: `Ошибка #${i}`,
      category: categories[Math.floor(Math.random() * categories.length)]!,
      priority: priorities[Math.floor(Math.random() * priorities.length)]!,
      status: statuses[Math.floor(Math.random() * statuses.length)]!,
      created_at: date.toISOString(),
      author_id: authors[Math.floor(Math.random() * authors.length)]!.id,
      author_name: authors[Math.floor(Math.random() * authors.length)]!.name,
    })
  }

  return additional
}

export const bugs = [...allBugs, ...generateAdditionalBugs()]
