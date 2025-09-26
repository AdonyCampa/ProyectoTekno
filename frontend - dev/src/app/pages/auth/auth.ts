import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './auth.html',
  styleUrls: ['./auth.scss'],
})
export class Auth {
  fb = inject(FormBuilder);
  hasEror = signal(false);
  isPosting = signal(false);
  router = inject(Router);
  showPassword = false;

  authService = inject(AuthService);

  loginForm = this.fb.group({
    usuario: ['admin', [Validators.required]],
    password: ['admin123', [Validators.required, Validators.minLength(6)]],
  });

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  login() {
    const { usuario = '', password = '' } = this.loginForm.value;

    this.authService.login(usuario!, password!).subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        Swal.fire('Exito', 'Inicio de sesion exitoso', 'success');
        this.router.navigateByUrl('/inicio');
        return;
      } else {
        Swal.fire('Eror', this.authService.msg()?.msg, 'error');
        return;
      }
    });
  }
}
