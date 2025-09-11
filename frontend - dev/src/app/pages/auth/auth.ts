import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-auth',
  imports: [ReactiveFormsModule],
  templateUrl: './auth.html',
  styleUrls: ['./auth.scss']
})
export class Auth {
  fb = inject(FormBuilder);
  hasEror = signal(false);
  isPosting = signal(false);
  router = inject(Router)

  authService = inject(AuthService);

  loginForm = this.fb.group({
    usuario: ['admin', [Validators.required]],
    password: ['123456', [Validators.required, Validators.minLength(6)]]
  });

  login() {
    if (this.loginForm.invalid) {
      this.hasEror.set(true);
      setTimeout(() => {
        this.hasEror.set(false);
      }, 2000);
      return;
    }

    const { usuario = '', password = '' } = this.loginForm.value;

    this.authService.login(usuario!, password!).subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        this.router.navigateByUrl('/inicio')
        return;
      }

      this.hasEror.set(true);
      setTimeout(() => {
        this.hasEror.set(false);
      }, 2000);
      return;

    })

  }
}
