# SeniorEase Mobile

Um aplicativo React Native com foco em acessibilidade para idosos, com Clean Architecture e boas práticas de desenvolvimento.

## 🎯 Características Principais

### 1. Painel de Personalização da Experiência
- Ajuste de tamanho de fonte (4 níveis)
- Contraste customizável (normal, alto, máximo)
- Espaçamento entre elementos
- Modo simplificado/avançado
- Feedback visual reforçado
- Confirmação de ações críticas

### 2. Organizador de Atividades
- Lista de tarefas simples e clara
- Etapas guiadas para execução
- Lembretes com linguagem clara
- Feedback de conclusão
- Histórico de atividades

### 3. Perfil + Configurações Persistentes
- Gerenciamento de perfil do usuário
- Armazenamento em Firestore
- Sincronização automática de preferências

## 🏗️ Arquitetura

O projeto segue **Clean Architecture** com separação clara de camadas:

```
src/
├── domain/              # Lógica de negócio pura
│   ├── entities/       # Modelos de dados
│   ├── repositories/   # Interfaces de repositório
│   └── usecases/       # Casos de uso
├── application/        # Lógica de aplicação
│   ├── services/       # Serviços que coordenam repositories e usecases
│   └── dto/            # Data Transfer Objects
├── infrastructure/     # Implementações externas
│   ├── firebase/       # Configuração Firebase
│   ├── database/       # Operações de banco
│   └── repositories/   # Implementações das interfaces
├── presentation/       # UI e componentes
│   ├── screens/        # Telas principais
│   ├── components/     # Componentes reutilizáveis
│   ├── hooks/          # Custom hooks
│   ├── navigation/     # Configuração de navegação
│   └── styles/         # Temas e estilos globais
└── shared/             # Código compartilhado
    ├── stores/         # Zustand stores (state management)
    ├── utils/          # Funções utilitárias
    └── constants/      # Constantes globais
```

## 🚀 Tecnologias

- **Framework**: React Native + Expo
- **State Management**: Zustand
- **Navegação**: React Navigation
- **Backend**: Firebase (Auth + Firestore)
- **Testes**: Jest + React Testing Library
- **Linguagem**: TypeScript

## 📋 Pré-requisitos

- Node.js >= 18
- npm ou yarn
- Expo CLI: `npm install -g expo-cli`

## 🔧 Configuração Inicial

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Firebase
As credenciais do Firebase já estão em:
```
src/infrastructure/firebase/config.ts
```

### 3. Rodar em Desenvolvimento
```bash
npm start
```

Isso abrirá o Expo CLI. Você pode:
- Pressionar `w` para abrir no web browser
- Pressionar `a` para abrir no Android Emulator
- Pressionar `i` para abrir no iOS Simulator

## 🧪 Testes

```bash
# Rodar todos os testes
npm test

# Rodar testes em modo watch
npm test -- --watch

# Cobertura de testes
npm test -- --coverage
```

## 📱 Estrutura de Navegação

```
Home (Root Navigator)
├── Auth Screen (não autenticado)
└── App Tabs (autenticado)
    ├── Home → Tasks Screen
    ├── Personalization Screen
    └── Profile Screen
```

## 🎨 Design System

### Tamanhos de Fonte
- `small`: 12px
- `medium`: 16px
- `large`: 20px
- `extra-large`: 24px

### Espaçamento
- `compact`: 4px
- `normal`: 8px
- `spacious`: 12px
- `extra-spacious`: 16px

### Cores Padrão
- Primary: #007AFF (Azul)
- Success: #34C759 (Verde)
- Error: #FF3B30 (Vermelho)
- Warning: #FF9500 (Laranja)

## 🔒 Segurança Firebase

### Regras de Firestore (Modo Teste)
```javascript
match /users/{userId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}
match /users/{userId}/tasks/{taskId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}
match /users/{userId}/settings/{settingId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}
```

**Nota**: Essas regras são apenas para testes. Para produção, ajuste conforme necessário.

## 📦 State Management (Zustand)

O projeto usa Zustand para gerenciar estado global:

### Auth Store
```typescript
useAuthStore()
- user: User | null
- setUser()
- logout()
```

### Settings Store
```typescript
useSettingsStore()
- settings: Settings | null
- updateAccessibilitySettings()
```

### Tasks Store
```typescript
useTasksStore()
- tasks: Task[]
- addTask()
- updateTask()
- deleteTask()
```

## 🔐 Autenticação

Implementada com Firebase Authentication (Email/Senha):

1. **Signup**: Cria usuário + perfil em Firestore
2. **Login**: Autentica e carrega configurações
3. **Logout**: Limpa estado local
4. **Persistent Login**: Verifica usuário atual ao iniciar app

## 💾 Modelo de Dados

### User
```typescript
{
  id: string;
  email: string;
  displayName: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Settings
```typescript
{
  userId: string;
  accessibility: {
    fontSize: 'small' | 'medium' | 'large' | 'extra-large';
    contrast: 'normal' | 'high' | 'maximum';
    spacing: 'compact' | 'normal' | 'spacious' | 'extra-spacious';
    interfaceMode: 'basic' | 'advanced';
    reinforcedFeedback: boolean;
    confirmCriticalActions: boolean;
  };
  notifications: {
    enableReminders: boolean;
    reminderTime: string; // HH:mm
    enableTaskCompletion: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

### Task
```typescript
{
  id: string;
  userId: string;
  title: string;
  description: string;
  steps: TaskStep[];
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  dueDate?: Date;
  reminderTime?: string;
}
```

## 📝 Próximos Passos

- [ ] Implementar autenticação Firebase real
- [ ] Persistência local com AsyncStorage
- [ ] Notificações push
- [ ] Integração com Figma para design final
- [ ] Testes E2E com Detox
- [ ] CI/CD Pipeline (opcional)
- [ ] Animações acessíveis
- [ ] Múltiplos idiomas

## 👥 Contribuição

As contribuições são bem-vindas! Por favor:

1. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
2. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
3. Push para a branch (`git push origin feature/AmazingFeature`)
4. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 📞 Suporte

Para dúvidas ou problemas:
1. Abra uma issue no repositório
2. Consulte a documentação do Firebase
3. Verifique a documentação do React Native

---

**Última atualização**: 2026-06-08
Sempre implemente em Container + View + Hook, com lógica no hook, UI pura na view, screen só orquestrando, TypeScript tipado e padrão visual do projeto