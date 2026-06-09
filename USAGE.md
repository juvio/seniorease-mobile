# 🔐 Guia de Uso - Autenticação e Integração

Este documento descreve como usar as funcionalidades de autenticação e dados do SeniorEase.

## 🚀 Como Usar a Autenticação

### 1. SignUp (Criar Conta)

Na tela de Login, ative o modo "Criar Conta" e preencha:
- Email: `usuario@example.com`
- Senha: `Senha123` (mínimo 6 caracteres)
- Nome: `Seu Nome`

O app irá:
1. Criar usuário no Firebase Auth
2. Armazenar perfil no Firestore
3. Criar configurações padrão
4. Fazer login automático

### 2. Login (Entrar)

Use as credenciais que criou:
- Email: `usuario@example.com`
- Senha: `Senha123`

O app irá:
1. Autenticar no Firebase
2. Carregar perfil do usuário
3. Carregar configurações personalizadas
4. Exibir dashboard

### 3. Logout (Sair)

Na tela de Perfil, clique em **"Sair da Conta"** e confirme.

---

## 🎯 Estrutura de Hooks Customizados

### `useAuth()` - Autenticação

```typescript
import { useAuth } from '@presentation/hooks/useAuth';

const { user, loading, error, signup, login, logout } = useAuth();

// Signup
try {
  await signup('email@test.com', 'password123', 'Nome');
} catch (error) {
  console.error(error);
}

// Login
try {
  await login('email@test.com', 'password123');
} catch (error) {
  console.error(error);
}

// Logout
await logout();
```

### `useTasks()` - Gerenciamento de Tarefas

```typescript
import { useTasks } from '@presentation/hooks/useTasks';

const { tasks, loading, error, loadTasks, addTask, updateTask } = useTasks();

// Carregar tarefas
useEffect(() => {
  loadTasks();
}, []);

// Adicionar tarefa
try {
  await addTask('Título da tarefa', 'Descrição');
} catch (error) {
  console.error(error);
}

// Atualizar tarefa (marcar como concluída)
const updatedTask = {
  ...task,
  completed: true,
  completedAt: new Date(),
};
await updateTask(updatedTask);
```

### `useSettings()` - Configurações de Acessibilidade

```typescript
import { useSettings } from '@presentation/hooks/useSettings';

const { settings, loading, updateSettings } = useSettings();

// Atualizar configurações
await updateSettings({
  fontSize: 'large',
  contrast: 'high',
  spacing: 'spacious',
});
```

---

## 📊 Estrutura de Dados no Firestore

### Usuário

```
users/{userId}
├── profile
│   ├── email: string
│   ├── displayName: string
│   ├── createdAt: timestamp
│   └── updatedAt: timestamp
```

### Configurações

```
users/{userId}/settings/preferences
├── accessibility
│   ├── fontSize: 'small' | 'medium' | 'large' | 'extra-large'
│   ├── contrast: 'normal' | 'high' | 'maximum'
│   ├── spacing: 'compact' | 'normal' | 'spacious' | 'extra-spacious'
│   ├── interfaceMode: 'basic' | 'advanced'
│   ├── reinforcedFeedback: boolean
│   └── confirmCriticalActions: boolean
├── notifications
│   ├── enableReminders: boolean
│   ├── reminderTime: string (HH:mm)
│   └── enableTaskCompletion: boolean
├── createdAt: timestamp
└── updatedAt: timestamp
```

### Tarefas

```
users/{userId}/tasks/{taskId}
├── title: string
├── description: string
├── steps: array
├── completed: boolean
├── dueDate: timestamp (opcional)
├── reminderTime: string (HH:mm, opcional)
├── createdAt: timestamp
├── updatedAt: timestamp
└── completedAt: timestamp (opcional)
```

---

## 🧪 Testando o App Localmente

### Pré-requisitos

1. Node.js >= 18
2. Expo CLI: `npm install -g expo-cli`
3. Firebase project configurado (já feito)

### Iniciar em Desenvolvimento

```bash
cd seniorease-mobile
npm start
```

Opções:
- Pressione **`w`** para abrir no navegador (web)
- Pressione **`a`** para abrir no Android Emulator
- Pressione **`i`** para abrir no iOS Simulator

### Testar Fluxo Completo

#### 1. **Tela de Autenticação**
```
1. Clique em "Não tem conta? Crie uma"
2. Preencha os campos
3. Clique em "Criar Conta"
4. Se sucesso → vai para dashboard
```

#### 2. **Personalizar Experiência**
```
1. Clique em "Personalizar" (aba)
2. Ajuste: Fonte, Contraste, Espaçamento
3. Ative: Feedback e Confirmação
4. Clique em "Salvar Alterações"
```

#### 3. **Adicionar Tarefas**
```
1. Clique em "Tarefas" (aba home)
2. Clique em "+ Adicionar Tarefa"
3. Preencha título e descrição
4. Clique em "Criar"
5. Clique na tarefa para marcar como concluída
```

#### 4. **Perfil**
```
1. Clique em "Perfil" (aba)
2. Veja informações do usuário
3. Clique em "Sair da Conta"
4. Confirme logout
5. Volta para tela de autenticação
```

---

## 🔍 Monitorando Dados no Firebase

### 1. Ver Usuários Criados

1. [Firebase Console](https://console.firebase.google.com/)
2. Selecione projeto `seniorease-mobile`
3. Vá para **Authentication > Users**
4. Veja usuários criados

### 2. Ver Dados no Firestore

1. Firebase Console → **Firestore Database**
2. Clique em **Dados**
3. Navegue: `users > {userId}`
4. Veja documentos: `profile`, `settings`, `tasks`

### 3. Ler Logs

1. Firebase Console → **Firestore Database**
2. Vá para **Regras**
3. Monitore acessos e permissões

---

## 🐛 Troubleshooting

### Erro: "Permission denied"
**Solução:**
- Verifique se está logado
- Confirme as regras de Firestore em FIREBASE.md
- Limpe cache: `npm start -- --clear`

### Erro: "User not found"
**Solução:**
- O usuário foi criado? Verifique em Firebase Console
- Tente criar nova conta

### Tarefas não aparecem
**Solução:**
- Recarregue a tela
- Verifique userId no Firestore
- Confirme regras de leitura

### App carrega eternamente
**Solução:**
- Verifique conexão internet
- Reinicie app: `Ctrl+C` e `npm start`
- Limpe node_modules: `npm install`

---

## 📚 Próximos Passos

- [ ] Implementar sincronização em tempo real (listeners)
- [ ] Adicionar notificações push
- [ ] Persistência local com AsyncStorage
- [ ] Backup/Restore de dados
- [ ] Integração com Figma para designs
- [ ] Dark mode support
- [ ] Múltiplos idiomas (i18n)

---

## 📞 Documentação de Referência

- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firestore Database](https://firebase.google.com/docs/firestore)
- [React Navigation](https://reactnavigation.org/)
- [Zustand](https://github.com/pmndrs/zustand)
- [React Native Docs](https://reactnative.dev/)

