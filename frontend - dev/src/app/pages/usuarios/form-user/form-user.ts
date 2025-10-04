import { Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../services/usuarios.service';
import { Usuario } from '../../../interfaces/usuarios';
import { Rol } from '../../../interfaces/roles';
import { RolService } from '../../../services/roles.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-user',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './form-user.html',
  styleUrl: './form-user.scss',
})
export class FormUser implements OnInit, OnChanges {
  fb = inject(FormBuilder);
  userService = inject(UserService);

  rolService = inject(RolService);
  roles: Rol[] = [];

  @Input() usuario: Usuario | null = null;
  @Input() modo: 'crear' | 'editar' | 'ver' = 'crear';

  userForm = this.fb.group(
    {
      id: 0,
      nombres: ['', [Validators.required, Validators.minLength(3)]],
      apellidos: ['', [Validators.required]],
      usuario: ['', [Validators.required]],
      rol: [0, [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      direccion: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      repeatpassword: [''],
      estado: [true, [Validators.required]],
    },
    {
      validators: this.passwordsMatchValidator, // validator global del grupo
    }
  );

  ngOnInit(): void {
    this.getRoles();
  }

  getRoles() {
    this.rolService.getRoles().subscribe((data) => (this.roles = data));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['usuario'] && this.usuario) {
      this.userForm.patchValue(this.usuario);
      if (this.modo === 'ver') {
        this.userForm.disable();
      } else {
        this.userForm.enable();
      }
    } else if (this.modo === 'crear') {
      this.userForm.reset();
      this.userForm.enable();
    }
  }

  // Validator global para comprobar que password y repeatPassword coincidan
  passwordsMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const repeat = group.get('repeatpassword')?.value;

    // Si ambos están vacíos (modo editar sin cambio de password), no marcar error
    if (!password && !repeat) {
      return null;
    }

    return password === repeat ? null : { passwordsMismatch: true };
  }

  save() {
    console.log(this.userForm.value);

    const {
      id,
      nombres,
      apellidos,
      usuario,
      rol,
      correo,
      direccion,
      estado,
      password,
      repeatpassword,
    } = this.userForm.value;
    if (this.modo === 'crear') {
      this.userService
        .crearUsuario(
          nombres,
          apellidos,
          usuario,
          rol,
          correo,
          direccion,
          estado,
          password,
          repeatpassword
        )
        .subscribe((ok) => {
          if (ok === true) {
            Swal.fire('Exito', 'Usuario creado exitosamente', 'success');
          } else {
            Swal.fire('Error', 'Error al crear usuario', 'error');
          }
          this.userForm.reset();
        });
    } else if (this.modo === 'editar') {
      this.userService
        .editarUsuario(id, nombres, apellidos, usuario, rol, correo, direccion, estado)
        .subscribe((ok) => {
          if (ok === true) {
            Swal.fire('Exito', 'Usuario editado exitosamente', 'success');
          } else {
            Swal.fire('Error', 'Error al editar Usuario', 'error');
          }
          this.userForm.reset();
        });
    }
  }
}
