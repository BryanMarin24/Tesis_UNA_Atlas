import { Component, inject, OnInit, WritableSignal , signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterLink, RouterOutlet } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from './auth.service';
import { FormsModule } from '@angular/forms';
import { MenuComponent } from './menu/menu.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, FormsModule, MenuComponent,HttpClientModule],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);

  // Signal para mostrar/ocultar menú
 showMenu: WritableSignal<boolean> = signal(true);
  ngOnInit(): void {
    // Sincroniza el usuario actual
    this.authService.user$.subscribe(user => {
      if (user) {
        this.authService.currentUserSig.set({
          email: user.email!,
          username: user.displayName ?? '',
        });
      } else {
        this.authService.currentUserSig.set(null);
      }
      console.log('Usuario actual:', this.authService.currentUserSig());
    });

    // Escucha cambios de ruta para mostrar u ocultar el menú
    this.router.events.subscribe(event => {
  if (event instanceof NavigationEnd) {
    const url = event.urlAfterRedirects;
    this.showMenu.set(!(url.includes('/login') || url.includes('/register')));
  }
});

  }
}
