import { inject, Injectable } from '@angular/core';
import { Contact, NewContact } from '../interfaces/contacto';
import { Auth } from './auth';
import { NewUser, User } from '../interfaces/user';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  authService = inject(Auth);

  async register(user: NewUser) {
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            title: 'Registrando usuario...',
            allowOutsideClick: false,
            showConfirmButton: false,
            willOpen: () => { Swal.showLoading(); }
        });
    }

    const res = await fetch('https://agenda-api.somee.com/api/Users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.authService.token,
      },
      body: JSON.stringify(user),
    });
    if (typeof Swal !== 'undefined') Swal.close();
    
    if (res.ok) {
        if (typeof Swal !== 'undefined') {
            await Swal.fire({
                icon: 'success',
                title: '¡Registro exitoso!',
                text: 'Ahora puedes iniciar sesión.',
                showConfirmButton: true,
            });
        }
    } else {
        const errorText = await res.text();
        if (typeof Swal !== 'undefined') {
             await Swal.fire({
                icon: 'error',
                title: 'Error al registrar',
                text: errorText || 'Ocurrió un error desconocido. Intenta más tarde.',
             });
        }
    }
    
    return res.ok;
  }
}
