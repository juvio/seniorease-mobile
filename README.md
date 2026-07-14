# SeniorEase Mobile

Aplicativo mobile acadêmico para apoio à rotina de idosos, com foco em acessibilidade digital, organização de tarefas e arquitetura limpa.

## Funcionalidades Principais

1. Personalização da experiência

- Tamanho de fonte
- Contraste
- Espaçamento
- Modo simplificado/avançado
- Feedback reforçado
- Confirmação de ações críticas

2. Organizador de tarefas

- Cadastro e edição de tarefas
- Conclusão e exclusão
- Histórico por status
- Recorrência semanal

3. Autenticação e persistência

- Login e cadastro com Firebase Auth
- Configurações e tarefas persistidas no Firestore

## Arquitetura

O projeto segue uma variação de Clean Architecture com composição central de dependências.

```text
src/
├── domain/                # Regras de negócio puras
│   ├── entities/
│   ├── repositories/      # Contratos (interfaces)
│   ├── usecases/
│   └── factories/
├── application/
│   ├── services/          # Orquestração de casos de uso e repositórios
│   └── container.ts       # Composition root (appContainer)
├── infrastructure/
│   ├── firebase/
│   └── repositories/      # Implementações concretas
├── presentation/
│   ├── screens/           # Screen orquestra
│   ├── hooks/             # Lógica da interface
│   ├── components/        # Views/componentes reutilizáveis
│   └── navigation/
└── shared/
    ├── stores/
    ├── utils/
    └── constants/
```

Padrão adotado na interface:

- Screen: apenas orquestra
- Hook: lógica de estado/ações
- View/Component: renderização e acessibilidade

## Tecnologias

- React Native + Expo
- TypeScript
- Firebase (Auth e Firestore)
- React Navigation
- Zustand
- Jest + Testing Library
- ESLint

## Passo a Passo para Rodar o Projeto

## 1. Pré-requisitos

Instale:

1. Node.js 18+
2. npm 9+
3. Git
4. Android Studio (para Android emulador) e/ou Xcode (para iOS no macOS)

Opcional:

1. Expo Go no celular

## 2. Clonar o repositório

```bash
git clone https://github.com/juvio/seniorease-mobile
cd seniorease-mobile
```

## 3. Instalar dependências

```bash
npm install
```

## 4. Configurar Firebase

O projeto usa variáveis `EXPO_PUBLIC_*` no arquivo de configuração.

Crie um arquivo `.env` na raiz (opcional, mas recomendado) com:

```bash
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
EXPO_PUBLIC_FIREBASE_APP_ID=...
```

Referência de configuração: `src/infrastructure/firebase/config.ts`.

## 5. Executar o app

Inicie o Metro/Expo:

```bash
npm start
```

Depois escolha um alvo:

1. Web:

```bash
npm run web
```

2. Android:

```bash
npm run android
```

3. iOS (apenas macOS):

```bash
npm run ios
```

## 6. Validar qualidade (obrigatório em contexto acadêmico)

1. Lint:

```bash
npm run lint
```

2. Type-check:

```bash
npm run type-check
```

3. Testes:

```bash
npm test -- --runInBand
```

4. Cobertura:

```bash
npm test -- --coverage
```

## 7. Fluxo recomendado de avaliação

Para banca/professor, execute nesta ordem:

1. `npm install`
2. `npm run lint`
3. `npm run type-check`
4. `npm test -- --runInBand`
5. `npm start` e demonstrar fluxos principais do app

## Navegação Atual

```text
Root Navigator
├── Auth (não autenticado)
└── App (autenticado)
    ├── Home (Tasks)
    └── Configurações (Personalization)
```

## Acessibilidade Implementada

- Escala de tipografia baseada em preferências
- Contraste ajustável
- Espaçamento ajustável
- Labels e roles de acessibilidade em controles interativos
- Feedback visual reforçado
- Confirmação de ações críticas (quando habilitada)

## Testes

Cobertura por camadas:

1. Domain (entidades, fábricas, use cases)
2. Infrastructure (repositórios)
3. Presentation hooks
4. Componentes críticos de acessibilidade
5. Stores e utilitários

## Estrutura de Scripts

```bash
npm start          # Expo dev server
npm run web        # Execução web
npm run android    # Build/run Android
npm run ios        # Build/run iOS
npm run lint       # ESLint
npm run type-check # TypeScript sem emissão
npm test           # Jest
```
