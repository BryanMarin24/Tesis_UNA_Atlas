import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterModule], // ✅ Aquí se habilita routerLink
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {

   authService = inject(AuthService)
  router = inject(Router);

    logout(): void {
    this.authService.logout().subscribe({
  next: () => {
    this.router.navigate(['/login']); // opcional redirección
  },
  error: err => console.error('Error al cerrar sesión', err)
});

  }

}
