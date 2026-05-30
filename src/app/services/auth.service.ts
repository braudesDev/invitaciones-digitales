import { Injectable, inject } from '@angular/core';
import {
  Auth,
  authState,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
} from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);

  currentUser$ = authState(this.auth);

  // Login con email y contraseña
  async login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  async sendPasswordReset(email: string) {
    return sendPasswordResetEmail(this.auth, email);
  }

  // Login con Google
  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(this.auth, provider);
      const user = result.user;

      // Verificar si el usuario ya existe en Firestore
      const userRef = doc(this.firestore, `users/${user.uid}`);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // Si es nuevo, crear documento con rol anfitrión
        await setDoc(userRef, {
          email: user.email,
          nombre: user.displayName,
          role: 'anfitrion',
          createdAt: new Date().toISOString(),
          photoURL: user.photoURL,
        });
      }

      return result;
    } catch (error) {
      console.error('Error en login con Google:', error);
      throw error;
    }
  }

  // Obtener rol del usuario
  async getUserRole(uid: string): Promise<string> {
    const userRef = doc(this.firestore, `users/${uid}`);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      return userSnap.data()['role'] || 'invitado';
    }
    return 'invitado';
  }

  // Verificar si es admin
  async isAdmin(): Promise<boolean> {
    const user = this.auth.currentUser;
    if (!user) return false;
    const role = await this.getUserRole(user.uid);
    return role === 'anfitrion';
  }

  // Cerrar sesión
  async logout() {
    await signOut(this.auth);
    this.router.navigate(['/']);
  }

  getCurrentUser() {
    return this.auth.currentUser;
  }
}
