import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import {provideFirebaseApp,initializeApp} from '@angular/fire/app'
import {provideAuth,getAuth} from '@angular/fire/auth'
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAsk02XFLZcPzjJBOS6kWz7qQ3V437yFWM",
  authDomain: "login-57024.firebaseapp.com",
  projectId: "login-57024",
  storageBucket: "login-57024.firebasestorage.app",
  messagingSenderId: "600887507591",
  appId: "1:600887507591:web:9f47de15a2285a98de1622"
};



export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), 
    provideHttpClient(),
    importProvidersFrom([provideFirebaseApp(()=>initializeApp(firebaseConfig)),
      provideAuth(()=> getAuth())
  ])
],
};


