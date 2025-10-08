import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FormUser } from '../../interfaces/user';
import { UsersService } from '../../services/users-service';

@Component({
  selector: 'app-register',
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
    
    // Validación mejorada
    if (this.isFormInvalid(form)) {
      this.errorRegister = true;
      return;
    }

    this.isLoading = true;
    
    try {
      const ok = await this.userService.register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
      });
      
      this.isLoading = false;

      if (ok) {
        // Registro exitoso, redirigir al login
        this.router.navigate(['/login']);
      } else {
        this.errorRegister = true;
      }
    } catch (error) {
      this.isLoading = false;
      this.errorRegister = true;
      console.error('Error en registro:', error);
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