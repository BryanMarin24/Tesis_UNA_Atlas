import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterModule],
})
export class LogicComponent {
  fb = inject(FormBuilder);
  http = inject(HttpClient);
  router = inject(Router);
  authService = inject(AuthService)
  form = this.fb.nonNullable.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });
  errorMessage: string | null = null;

 onSubmit(): void {
    const rawForm = this.form.getRawValue()
    this.authService
    .login(rawForm.email,rawForm.password)
    .subscribe({
      next:() => {
      this.router.navigateByUrl('/inicio');
    },
    error:(err) => {
      this.errorMessage = 'Usuario / Contraseña incorrecto';
    },
    });
  }
}
