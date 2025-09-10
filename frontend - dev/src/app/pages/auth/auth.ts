import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-auth',
  imports: [ReactiveFormsModule],
  templateUrl: './auth.html',
  styleUrls: ['./auth.scss']
})
export class Auth implements OnInit {

  form!: FormGroup;
  visible = false;

  initForm(): void {
    this.form = this.fb.group({
      usuario: ['admin', [Validators.required]],
      password: ['123456', [Validators.required, Validators.minLength(6)]]
    });
  }
  constructor(private fb: FormBuilder,
    private router: Router,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.initForm();
  }

  login() {
    console.log(this.form.value);
    const { usuario, password } = this.form.value;

    this.authService.login(usuario, password).subscribe(ok => {
      console.log(ok);
      if (ok === true) {
        this.router.navigateByUrl('/inicio');
      } else {
        Swal.fire('Error', ok, 'error')
      }

    })



  }
}
