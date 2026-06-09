# 🧪 Guia de Testes - SeniorEase Mobile

## Executar Testes Unitários

```bash
# Instalar dependências de teste (se necessário)
npm install --save-dev @testing-library/react-native @testing-library/jest-native jest @types/jest

# Rodar todos os testes
npm test

# Rodar em modo watch (reexecuta ao salvar)
npm test -- --watch

# Gerar relatório de cobertura
npm test -- --coverage

# Rodar teste específico
npm test -- validators.test.ts
```

## Testes Implementados

### 1. Validadores (`src/shared/utils/validators.test.ts`)
- ✅ Validação de email
- ✅ Validação de senha
- ✅ Validação de título de tarefa

### 2. Autenticação (`src/domain/usecases/auth.test.ts`)
- ✅ Signup com credenciais válidas
- ✅ Rejeição de email inválido
- ✅ Rejeição de senha fraca
- ✅ Rejeição de nome vazio
- ✅ Login com credenciais válidas

### 3. Tarefas (`src/infrastructure/repositories/tasks.test.ts`)
- ✅ Criação de tarefas
- ✅ Tarefas com etapas
- ✅ Marcar como concluída
- ✅ Rastreamento de timestamps
- ✅ Filtros de tarefas
- ✅ Ordenação

### 4. Configurações (`src/domain/entities/settings.test.ts`)
- ✅ Configurações de acessibilidade padrão
- ✅ Mudança de tamanho de fonte
- ✅ Mudança de contraste
- ✅ Mudança de espaçamento
- ✅ Alternância de modo de interface
- ✅ Documentos completos de configurações

## Testar Manualmente no App

### 1. Testar Signup
```bash
npm start
# ou npm run web para web
```

**Passos:**
1. Clique em "Não tem conta? Crie uma"
2. Preencha:
   - Email: `teste@example.com`
   - Senha: `Senha123`
   - Nome: `Seu Nome`
3. Clique em "Criar Conta"
4. ✅ Deve redirecionar para dashboard

### 2. Testar Login
```bash
1. Clique em "Já tem conta? Faça login"
2. Preencha:
   - Email: `teste@example.com`
   - Senha: `Senha123`
3. Clique em "Entrar"
4. ✅ Deve redirecionar para dashboard
```

### 3. Testar Personalização
```bash
1. Clique na aba "Personalizar"
2. Teste cada ajuste:
   - Selecione "large" para fonte
   - Selecione "high" para contraste
   - Selecione "spacious" para espaçamento
   - Ative "Modo Simplificado"
   - Ative "Feedback Visual"
3. Clique em "Salvar Alterações"
4. ✅ Deve salvar no Firestore
```

### 4. Testar Tarefas
```bash
1. Clique na aba "Tarefas"
2. Clique em "+ Adicionar Tarefa"
3. Preencha:
   - Título: "Fazer compras"
   - Descrição: "Comprar leite e pão"
4. Clique em "Criar"
5. ✅ Tarefa aparece na lista
6. Clique na tarefa
7. ✅ Marca como concluída (checkmark)
```

### 5. Testar Perfil
```bash
1. Clique na aba "Perfil"
2. Veja seus dados
3. Clique em "Sair da Conta"
4. Confirme logout
5. ✅ Volta para tela de autenticação
6. Login novamente
7. ✅ Tarefas e configurações persistem
```

## Verificar Dados no Firebase

### 1. Verificar Usuário Criado
```
Firebase Console
→ Authentication
→ Users
→ Procure seu email
```

### 2. Verificar Dados no Firestore
```
Firebase Console
→ Firestore Database
→ Dados
→ users > {userId}
  → profile
  → settings > preferences
  → tasks > {taskId}
```

## 🐛 Testes de Erro

### Teste: Email Inválido
```
Campo: Email
Valor: "invalidemail"
Esperado: Erro "Email inválido"
```

### Teste: Senha Fraca
```
Campo: Senha
Valor: "123"
Esperado: Erro "Senha deve ter pelo menos 6 caracteres"
```

### Teste: Campo Vazio
```
Campo: Nome (signup)
Valor: ""
Esperado: Erro "Por favor, digite seu nome"
```

### Teste: Sem Conexão
```
1. Desabilite internet
2. Tente fazer login
3. Esperado: Erro "Network error"
4. Reabilite internet
5. Tente novamente
6. Esperado: Sucesso
```

## 📊 Checklist de Testes

### Autenticação
- [ ] Signup com dados válidos
- [ ] Signup com email inválido
- [ ] Signup com senha fraca
- [ ] Login com dados válidos
- [ ] Login com email inválido
- [ ] Logout funciona
- [ ] Sessão persiste após reinicio

### Personalização
- [ ] Mudar tamanho de fonte
- [ ] Mudar contraste
- [ ] Mudar espaçamento
- [ ] Ativar modo básico
- [ ] Ativar feedback reforçado
- [ ] Ativar confirmação
- [ ] Salvar e recarregar

### Tarefas
- [ ] Criar tarefa
- [ ] Adicionar descrição
- [ ] Marcar como concluída
- [ ] Desmarcar tarefa
- [ ] Deletar tarefa
- [ ] Tarefas persistem

### UI/UX
- [ ] Botões têm min 48px
- [ ] Textos legíveis
- [ ] Contraste adequado
- [ ] Espaçamento apropriado
- [ ] Sem crashes
- [ ] Animações suaves

## 📈 Métricas de Qualidade

```
Cobertura mínima: 80%
Testes críticos: 100%
Performance: < 500ms
Zero crashes por sessão
```

## 🔧 Debug

### Ver Logs
```bash
# Web
npm run web
# Abra DevTools (F12)
# Aba Console
```

### Ver Dados Firestore em Tempo Real
```javascript
// No console do browser
db.collection('users').onSnapshot(snapshot => {
  snapshot.forEach(doc => {
    console.log(doc.id, doc.data());
  });
});
```

### Limpar Cache
```bash
# Limpar Expo cache
npm start -- --clear

# Limpar node_modules
rm -rf node_modules
npm install
```

---

**Última atualização**: 2026-06-08
