import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { IAuthRepository } from '../../domain/repositories/IAuthRepository';
import { User } from '../../domain/entities/User';

export class FirebaseAuthRepository implements IAuthRepository {
  async signup(email: string, password: string, displayName: string): Promise<User> {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    const user: User = {
      id: firebaseUser.uid,
      email: firebaseUser.email || '',
      displayName,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Save user profile to Firestore
    await setDoc(doc(db, 'users', user.id), {
      email: user.email,
      displayName: user.displayName,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });

    return user;
  }

  async login(email: string, password: string): Promise<User> {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Get user profile from Firestore
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    const userData = userDoc.data();

    const user: User = {
      id: firebaseUser.uid,
      email: firebaseUser.email || '',
      displayName: userData?.displayName || 'Usuário',
      createdAt: userData?.createdAt?.toDate() || new Date(),
      updatedAt: userData?.updatedAt?.toDate() || new Date(),
    };

    return user;
  }

  async logout(): Promise<void> {
    await signOut(auth);
  }

  async getCurrentUser(): Promise<User | null> {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) {
      return null;
    }

    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    const userData = userDoc.data();

    return {
      id: firebaseUser.uid,
      email: firebaseUser.email || '',
      displayName: userData?.displayName || 'Usuário',
      createdAt: userData?.createdAt?.toDate() || new Date(),
      updatedAt: userData?.updatedAt?.toDate() || new Date(),
    };
  }

  async updateProfile(displayName: string): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error('Usuário não autenticado');

    await setDoc(doc(db, 'users', user.uid), { displayName }, { merge: true });
  }
}
