import { Component, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { FormsModule, NgForm   } from '@angular/forms';
import { ContactsService } from '../../services/contacts-service'; 
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login-page',
  standalone: true, 
  imports: [RouterModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.sass'
})
export class LoginPage {
  authService = inject(Auth);
  router = inject(Router);
  contactsService = inject(ContactsService);

  errorlogin = false;
  isSubmitting = false;

  async login(form: NgForm) {
    this.errorlogin = false;
    if (!form.valid) { 
      this.errorlogin = true; 
      return;
    }
    this.isSubmitting = true;
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            title: 'Iniciando sesión...',
            allowOutsideClick: false,
            showConfirmButton: false,
            willOpen: () => { Swal.showLoading(); }
        });
    }
    const loginresult = await this.authService.login(form.value);
    if (typeof Swal !== 'undefined') Swal.close();
    this.isSubmitting = false;

    if (loginresult) {
      await this.contactsService.getContacts(); 
      this.router.navigate(['/']);
    } else {
      this.errorlogin = true;
      if (typeof Swal !== 'undefined') {
        Swal.fire({
            icon: 'error',
            title: 'Error de credenciales',
            text: 'Usuario o contraseña incorrectos.',
        });
      }
    }
  }
}