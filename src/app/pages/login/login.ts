import { Component, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { FormsModule, NgForm   } from '@angular/forms';
import { ContactsService } from '../../services/contacts-service'; // Importamos el ContactsService

@Component({
  selector: 'app-login-page',
  imports: [RouterModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.sass'
})
export class LoginPage {
  authService = inject(Auth);
  router = inject(Router);
  contactsService = inject(ContactsService); // Inyectamos el ContactsService

  errorlogin = false;

  async login(form: NgForm) {
    console.log('Formulario de Login', form.value);
    this.errorlogin = false;
    if (!form.value.email || !form.value.password) {
      this.errorlogin = true; 
      return;
    }

    const loginresult = await this.authService.login(form.value);
    if (loginresult) {
      // Si el login fue exitoso, cargamos los contactos antes de navegar
      await this.contactsService.getContacts();
      this.router.navigate(['/']);
    } else {
      this.errorlogin = true;
    }
  }
}