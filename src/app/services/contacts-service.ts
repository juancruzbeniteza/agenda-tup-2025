import { inject, Injectable } from '@angular/core';
import { Contact, NewContact } from '../interfaces/contacto';
import { Auth } from './auth';
import Swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  authService = inject(Auth);
  readonly URL_BASE = "https://agenda-api.somee.com/api/Contacts"; 
  contacts:Contact[] = [];

  async createContact(nuevoContacto:NewContact) {
    // ⚠️ Se eliminó la condición 'typeof Swal'
    Swal.fire({
        title: 'Creando contacto...',
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => { Swal.showLoading(); }
    });

    const res = await fetch(this.URL_BASE, 
      {
        method:"POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer "+this.authService.token,
        },
        body: JSON.stringify(nuevoContacto)
      });
      
    Swal.close(); // ⚠️ Se eliminó la condición 'typeof Swal'
    
    // 💡 Validación 401: Manejar expiración de token
    if (res.status === 401) {
        this.authService.logout();
        Swal.fire('Sesión Expirada', 'Tu sesión ha expirado. Por favor, vuelve a iniciar sesión.', 'warning');
        return;
    }

    if(!res.ok) {
        Swal.fire('Error', 'No se pudo crear el contacto.', 'error'); // ⚠️ Se eliminó la condición 'typeof Swal'
        return;
    }
    const resContact:Contact = await res.json();
    this.contacts.push(resContact);
    return resContact;
  }

  // 🗑️ MÉTODO CORREGIDO: Se eliminó la confirmación redundante de SweetAlert
  async deleteContact(id:number){
    Swal.fire({
        title: 'Eliminando...',
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => { Swal.showLoading(); }
    });

    const res = await fetch(this.URL_BASE+"/"+id, 
      {
        method: "DELETE",
        headers: {
          Authorization: "Bearer "+this.authService.token,
        },
      });
      
    Swal.close(); // ⚠️ Se eliminó la condición 'typeof Swal'
    
    // 💡 Validación 401: Manejar expiración de token
    if (res.status === 401) {
        this.authService.logout();
        Swal.fire('Sesión Expirada', 'Tu sesión ha expirado. Por favor, vuelve a iniciar sesión.', 'warning');
        return false; 
    }

    if(!res.ok) {
        Swal.fire('Error', 'Error al eliminar el contacto.', 'error'); // ⚠️ Se eliminó la condición 'typeof Swal'
        return false; 
    }
    
    this.contacts = this.contacts.filter(contact => contact.id !== id);
    Swal.fire('¡Borrado!', 'El contacto ha sido eliminado.', 'success'); // ⚠️ Se eliminó la condición 'typeof Swal'
    return true; 
  }
  
  async editContact(contact:Contact){
    // ⚠️ Se eliminó la condición 'typeof Swal'
    Swal.fire({
        title: 'Guardando cambios...',
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => { Swal.showLoading(); }
    });

    const res = await fetch(this.URL_BASE+"/"+contact.id, 
      {
        method:"PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer "+this.authService.token,
        },
        body: JSON.stringify(contact)
      });

    Swal.close(); // ⚠️ Se eliminó la condición 'typeof Swal'
    
    // 💡 Validación 401: Manejar expiración de token
    if (res.status === 401) {
        this.authService.logout();
        Swal.fire('Sesión Expirada', 'Tu sesión ha expirado. Por favor, vuelve a iniciar sesión.', 'warning');
        return;
    }

    if(!res.ok) {
        Swal.fire('Error', 'Error al editar el contacto.', 'error'); // ⚠️ Se eliminó la condición 'typeof Swal'
        return;
    }
    
    this.contacts = this.contacts.map(oldContact =>{
      if(oldContact.id === contact.id) return contact;
      return oldContact
    })
    return contact;
  }
  
  async getContacts(){
    const res = await fetch(this.URL_BASE,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer "+this.authService.token
        }
      })
      // 💡 Validación 401: Manejar expiración de token
      if (res.status === 401) {
        this.authService.logout();
        Swal.fire('Sesión Expirada', 'Tu sesión ha expirado. Por favor, vuelve a iniciar sesión.', 'warning');
        return;
      }

      if(res.ok){
        const resJson:Contact[] = await res.json()
        this.contacts = resJson;
      }
  }
  
  async getContactById(id:string | number){
    const res = await fetch(this.URL_BASE+"/"+id,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer "+this.authService.token
        }
      })
      // 💡 Validación 401: Manejar expiración de token
      if (res.status === 401) {
        this.authService.logout();
        Swal.fire('Sesión Expirada', 'Tu sesión ha expirado. Por favor, vuelve a iniciar sesión.', 'warning');
        return null;
      }
      
      if(res.ok){
        const resJson:Contact = await res.json()
        return resJson;
      }
      return null;
  }
  
  async setFavourite(id:string | number ) {
    // ⚠️ Se eliminó la condición 'typeof Swal'
    Swal.fire({
        title: 'Actualizando favorito...',
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => { Swal.showLoading() }
    });

    const res = await fetch(this.URL_BASE+"/"+id+"/favorite", 
      {
        method: "POST",
        headers: {
          Authorization: "Bearer "+this.authService.token,
        },
      });
    Swal.close(); // ⚠️ Se eliminó la condición 'typeof Swal'
    
    // 💡 Validación 401: Manejar expiración de token
    if (res.status === 401) {
        this.authService.logout();
        Swal.fire('Sesión Expirada', 'Tu sesión ha expirado. Por favor, vuelve a iniciar sesión.', 'warning');
        return false;
    };
    
    if(!res.ok) {
        Swal.fire('Error', 'No se pudo actualizar el favorito en la API.', 'error'); // ⚠️ Se eliminó la condición 'typeof Swal'
        return false;
    };
    
    this.contacts = this.contacts.map(contact => {
      const contactId = typeof id === 'string' ? Number(id) : id; 

      if(contact.id === contactId) {
        return {...contact, isFavorite: !contact.isFavorite}; 
      };
      return contact;
    });
    return true;
  }
}