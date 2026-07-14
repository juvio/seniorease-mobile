import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './config';

export const testFirestoreConnection = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    // Verificar se está autenticado
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return { success: true };
    }

    const testDocPath = `_tests/${currentUser.uid}`;
    const testData = {
      timestamp: new Date(),
      uid: currentUser.uid,
      test: true,
    };

    // Teste 1: Tentar escrever
    await setDoc(doc(db, testDocPath), testData);

    // Teste 2: Tentar ler
    const docSnap = await getDoc(doc(db, testDocPath));
    if (docSnap.exists()) {
    } else {
      console.error('[TEST] ✗ Documento não encontrado após escrita');
      return { success: false, error: 'Documento não encontrado após escrita' };
    }

    return { success: true };
  } catch (error: any) {
    const errorMessage = error?.message || JSON.stringify(error);
    console.error('[TEST] ✗ Erro na conexão Firestore:', errorMessage);
    console.error('[TEST] Código de erro:', error?.code);
    
    return { 
      success: false, 
      error: errorMessage 
    };
  }
};
