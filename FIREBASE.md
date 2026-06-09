# 🔥 Guia de Integração Firebase

Este documento descreve como conectar o aplicativo SeniorEase com o Firebase para produção.

## ✅ Status Atual

- [x] Projeto Firebase criado
- [x] Authentication (Email/Senha) ativado
- [x] Firestore Database criado
- [x] Configuração adicionada ao projeto
- [ ] Testes com dados reais
- [ ] Deploy para produção

## 🔑 Credenciais

Seu projeto Firebase está configurado em:
```
src/infrastructure/firebase/config.ts
```

**Credenciais:**
- projectId: `seniorease-mobile`
- authDomain: `seniorease-mobile.firebaseapp.com`
- API Key: `AIzaSyA-Qo06AnGXQtJqquGMIDF8sIYc7kSDryE`

## 📁 Estrutura Firestore

```
seniorease-mobile (banco de dados)
└── users/
    └── {userId}/
        ├── profile (documento)
        │   ├── email: string
        │   ├── displayName: string
        │   ├── createdAt: timestamp
        │   └── updatedAt: timestamp
        │
        ├── settings/ (coleção)
        │   └── preferences (documento)
        │       ├── accessibility: object
        │       ├── notifications: object
        │       ├── createdAt: timestamp
        │       └── updatedAt: timestamp
        │
        └── tasks/ (coleção)
            └── {taskId} (documento)
                ├── title: string
                ├── description: string
                ├── steps: array
                ├── completed: boolean
                ├── dueDate: timestamp
                ├── reminderTime: string
                ├── createdAt: timestamp
                ├── updatedAt: timestamp
                └── completedAt: timestamp (opcional)
```

## 🔐 Regras de Segurança (Firestore)

As regras atuais estão em **modo teste** (permitem leitura/escrita irrestrita):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /users/{userId}/tasks/{taskId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /users/{userId}/settings/{settingId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

**Para Produção:**
1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Selecione seu projeto
3. Vá para **Firestore > Regras**
4. Aplique as regras acima (ou mais restritivas conforme necessário)
5. Clique **Publicar**

## 🧪 Testar Integração

### 1. Criar Usuário via Firebase Console

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Selecione projeto `seniorease-mobile`
3. Vá para **Authentication > Users**
4. Clique **Adicionar usuário**
5. Preencha:
   - Email: `teste@example.com`
   - Senha: `Senha123`
6. Clique **Criar**

### 2. Testar Signup no App

```typescript
// Em AuthScreen.tsx
const handleSignup = async () => {
  try {
    const authService = new AuthService();
    const user = await authService.signup(
      'novo@example.com',
      'Senha123',
      'Seu Nome'
    );
    console.log('Usuário criado:', user);
  } catch (error) {
    console.error('Erro:', error);
  }
};
```

### 3. Testar Login no App

```typescript
const handleLogin = async () => {
  try {
    const authService = new AuthService();
    const user = await authService.login(
      'teste@example.com',
      'Senha123'
    );
    console.log('Usuário autenticado:', user);
  } catch (error) {
    console.error('Erro:', error);
  }
};
```

## 📊 Monitoramento

### Ver Dados no Firestore

1. Firebase Console → Firestore Database
2. Clique em **Dados**
3. Navegue em `users > {userId}`

### Ver Logs de Autenticação

1. Firebase Console → Authentication
2. Vá para **Logs**
3. Procure por tentativas de login/signup

## 🛠️ Troubleshooting

### Erro: "Permission denied"
- Verifique se o usuário está autenticado
- Confirme as regras de Firestore
- Verifique se o userId está correto

### Erro: "Document already exists"
- Tente fazer login ao invés de signup
- Limpe o cache local do Firestore

### Erro: "Invalid API key"
- Verifique a chave no `config.ts`
- Regenere as credenciais no Firebase Console

## 📱 Próximos Passos

1. **Conectar autenticação real** no `AuthService`
2. **Sincronizar dados** com Firestore em tempo real
3. **Backup automático** com cloud backup
4. **Analytics** para rastrear uso do app

## 📚 Documentação Oficial

- [Firebase Auth](https://firebase.google.com/docs/auth)
- [Firestore](https://firebase.google.com/docs/firestore)
- [React Native Firebase](https://rnfirebase.io/)
