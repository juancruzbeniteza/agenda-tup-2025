import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FormUser } from '../../interfaces/user';
import { UsersService } from '../../services/users-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  standalone: true, 
  imports: [FormsModule, RouterLink],
  templateUrl: './register-page.html',
  styleUrl: './register-page.sass',
})
export class RegisterPage {
  isLoading = false; 
  errorRegister = false;

  userService = inject(UsersService);
  router = inject(Router);

  async register(form: FormUser) {
    this.errorRegister = false;
    if (this.isFormInvalid(form)) {
      this.errorRegister = true;
      return;
    }
    this.isLoading = true;
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            title: 'Registrando usuario...',
            allowOutsideClick: false,
            showConfirmButton: false,
            willOpen: () => { Swal.showLoading(); }
        });
    }

    try {
      const ok = await this.userService.register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
      });
    
      this.isLoading = false;
      if (typeof Swal !== 'undefined') Swal.close();


      if (ok) {
        if (typeof Swal !== 'undefined') {
          await Swal.fire({
            icon: 'success',
            title: '¡Registro exitoso!',
            text: 'Ahora podés iniciar sesión.',
            confirmButtonText: 'Ir a Iniciar Sesión'
          });
        }
        this.router.navigate(['/login']);
      } else {
        this.errorRegister = true;
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                icon: 'error',
                title: 'Error al registrar',
                text: 'El email ya está registrado o el servidor falló.',
            });
        }
      }
    } catch (error) {
      this.isLoading = false;
      this.errorRegister = true;
      if (typeof Swal !== 'undefined') Swal.close();
      
      console.error('Error en registro:', error);
      if (typeof Swal !== 'undefined') {
            Swal.fire({
                icon: 'error',
                title: 'Error de conexión',
                text: 'No se pudo conectar con el servidor.',
            });
      }
    }
  }

  private isFormInvalid(form: FormUser): boolean {
    return (
      !form.firstName?.trim() ||
      !form.lastName?.trim() ||
      !form.email?.trim() ||
      !form.password ||
      !form.password2 ||
      form.password !== form.password2 ||
      form.password.length < 6
    );
  }
}
