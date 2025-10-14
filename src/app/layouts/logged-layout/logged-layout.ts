import { Component, inject } from '@angular/core';
import { RouterModule, RouterOutlet, Router } from '@angular/router';
import { Auth } from '../../services/auth';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-logged-layout',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './logged-layout.html',
  styleUrl: './logged-layout.sass'
})
export class LoggedLayout {
  authService = inject(Auth);
  router = inject(Router);

  async handleLogout() {
    const result = await Swal.fire({
      title: '¿Cerrar sesión?',
      text: 'Tendrás que volver a ingresar tus credenciales.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#007aff',
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      this.authService.logout();
      await Swal.fire({
        title: 'Sesión cerrada',
        icon: 'success',
        confirmButtonColor: '#007aff',
        timer: 1500,
        showConfirmButton: false
      });
      this.router.navigate(['/login']);
    }
  }
}