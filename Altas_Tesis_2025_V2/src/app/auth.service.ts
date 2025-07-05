    import { inject, Injectable, signal } from "@angular/core";
    import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, user } from "@angular/fire/auth";
    import { from, Observable } from "rxjs";
    import { UserInterface } from "./user.interface";

    @Injectable({
    providedIn: 'root'
    })
    export class AuthService{
        firebaseAuth = inject(Auth)
        user$ = user(this.firebaseAuth)
        currentUserSig = signal<UserInterface | null | undefined>(undefined)

        register(email: string, username: string, password: string): Observable<void> {
  const promise = createUserWithEmailAndPassword(this.firebaseAuth, email, password)
    .then(response => {
      return updateProfile(response.user, { displayName: username }).then(() => {
        this.currentUserSig.set({
          email: response.user.email!,
          username: username
        });
      });
    });
  return from(promise);
}

        login(email: string, password: string): Observable<void> {
  const promise = signInWithEmailAndPassword(this.firebaseAuth, email, password)
    .then(response => {
      this.currentUserSig.set({
        email: response.user.email!,
        username: response.user.displayName ?? ''
      });
    });
  return from(promise);
}

        logout(): Observable<void> {
  const promise = signOut(this.firebaseAuth).then(() => {
    this.currentUserSig.set(null); // Limpiar usuario actual
  });
  return from(promise);
}

    }