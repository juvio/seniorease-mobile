#!/bin/bash
# SeniorEase Mobile - Useful Commands

# ==========================================
# DEVELOPMENT
# ==========================================

# Start development server
npm start

# Start on web browser
npm run web

# Start on Android emulator
npm run android

# Start on iOS simulator
npm run ios

# ==========================================
# TESTING
# ==========================================

# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- src/shared/utils/validators.test.ts

# Generate coverage report
npm test -- --coverage

# Run tests with verbose output
npm test -- --verbose

# ==========================================
# GIT COMMANDS
# ==========================================

# Check status
git status

# View commits
git log --oneline

# View graph
git log --graph --oneline --all

# Create new branch
git checkout -b feature/new-feature

# Commit changes
git add .
git commit -m "feat: Add new feature"

# Push to remote
git push origin main

# ==========================================
# TYPESCRIPT
# ==========================================

# Type check (no compilation)
npx tsc --noEmit

# Compile TypeScript
npx tsc

# ==========================================
# CLEANING
# ==========================================

# Clear Expo cache
npm start -- --clear

# Clean node_modules
rm -rf node_modules
npm install

# Clear watchman cache (Mac/Linux)
watchman watch-del-all

# ==========================================
# FIREBASE
# ==========================================

# Open Firebase Console
# https://console.firebase.google.com/project/seniorease-mobile

# View logs in Firestore
# Console > Firestore > Rules > See realtime logs

# ==========================================
# DEBUGGING
# ==========================================

# View Firestore in console
db.collection('users').get().then(snapshot => {
  snapshot.forEach(doc => console.log(doc.id, doc.data()))
})

# View auth state
auth.onAuthStateChanged(user => {
  console.log('Current user:', user)
})

# ==========================================
# BUILD
# ==========================================

# Build for web
npm run build:web

# Export for production
expo export --platform web

# ==========================================
# DOCUMENTATION
# ==========================================

# View project overview
cat README.md

# View Firebase setup
cat FIREBASE.md

# View usage guide
cat USAGE.md

# View testing guide
cat TESTING.md

# View roadmap
cat ROADMAP.md

# View implementation checklist
cat CHECKLIST.md

# View project summary
cat SUMMARY.md

# ==========================================
# USEFUL ALIASES
# ==========================================

# Add to ~/.zshrc or ~/.bashrc

# alias se-start='npm start'
# alias se-test='npm test'
# alias se-web='npm run web'
# alias se-logs='git log --oneline'
# alias se-status='git status'
