import { inject, Injectable, OnInit } from '@angular/core';
import { LoginData } from '../interfaces/auth';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class Auth implements OnInit {
  ngOnInit(): void {
    if (this.token) {
      this.revisionTokenInterval = this.revisionToken()
    }
  }

  token: null | string = localStorage.getItem("token");
  router = inject(Router);
  revisionTokenInterval: any; 

  async login(loginData: LoginData) {
    Swal.fire({
        title: 'Iniciando sesión...',
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => { Swal.showLoading(); }
    });

    const res = await fetch('https://agenda-api.somee.com/api/authentication/authenticate',
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      }
    );
    Swal.close();
    
    if (res.ok) {
      const resText = await res.text()
      this.token = resText;
      localStorage.setItem("token", this.token);
      this.revisionTokenInterval = this.revisionToken()
      Swal.fire({
          icon: 'success',
          title: '¡Bienvenido!',
          showConfirmButton: false,
          timer: 1500
      });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Error de inicio de sesión',
            text: 'Usuario o contraseña incorrectos.',
         });
    }
    return res.ok;
  }
  async logout() {
    localStorage.removeItem("token");
    this.token = null;
    this.router.navigate(["/login"]);
    if(this.revisionTokenInterval) clearInterval(this.revisionTokenInterval); 
  }
  revisionToken(): any {
    return setInterval(() => {
      if (this.token) {
        try {
          const parts = this.token.split('.');
          if (parts.length !== 3) {
            this.logout();
            return;
          }
          
          const base64Url = parts[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));

          const claims: { exp: number } = JSON.parse(jsonPayload);
          if (new Date(claims.exp * 1000) < new Date()) {
            this.logout()
          }
        } catch(error) {
           console.error("Token de autenticación corrupto:", error);
           this.logout(); 
        }
      }
    }, 300000) 
  }
}