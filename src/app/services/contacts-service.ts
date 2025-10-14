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
    if(typeof Swal !== 'undefined') {
        Swal.fire({
            title: 'Creando contacto...',
            allowOutsideClick: false,
            showConfirmButton: false,
            willOpen: () => { Swal.showLoading(); }
        });
    }

    const res = await fetch(this.URL_BASE, 
      {
        method:"POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer "+this.authService.token,
        },
        body: JSON.stringify(nuevoContacto)
      });
      
    if(typeof Swal !== 'undefined') Swal.close();
    
    if(!res.ok) {
        if(typeof Swal !== 'undefined') Swal.fire('Error', 'No se pudo crear el contacto.', 'error');
        return;
    }
    const resContact:Contact = await res.json();
    this.contacts.push(resContact);
    return resContact;
  }
  async deleteContact(id:number){
    if(typeof Swal !== 'undefined') {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "¡No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, borrar',
            cancelButtonText: 'Cancelar'
        });

        if (!result.isConfirmed) {
            return false;
        }

        Swal.fire({
            title: 'Eliminando...',
            allowOutsideClick: false,
            showConfirmButton: false,
            willOpen: () => { Swal.showLoading(); }
        });
    }

    const res = await fetch(this.URL_BASE+"/"+id, 
      {
        method: "DELETE",
        headers: {
          Authorization: "Bearer "+this.authService.token,
        },
      });
      
    if(typeof Swal !== 'undefined') Swal.close();
    
    if(!res.ok) {
        if(typeof Swal !== 'undefined') Swal.fire('Error', 'Error al eliminar el contacto.', 'error');
        return false; 
    }
    
    this.contacts = this.contacts.filter(contact => contact.id !== id);
    if(typeof Swal !== 'undefined') Swal.fire('¡Borrado!', 'El contacto ha sido eliminado.', 'success');
    return true; 
  }
  async editContact(contact:Contact){
    if(typeof Swal !== 'undefined') {
        Swal.fire({
            title: 'Guardando cambios...',
            allowOutsideClick: false,
            showConfirmButton: false,
            willOpen: () => { Swal.showLoading(); }
        });
    }

    const res = await fetch(this.URL_BASE+"/"+contact.id, 
      {
        method:"PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer "+this.authService.token,
        },
        body: JSON.stringify(contact)
      });

    if(typeof Swal !== 'undefined') Swal.close();
    
    if(!res.ok) {
        if(typeof Swal !== 'undefined') Swal.fire('Error', 'Error al editar el contacto.', 'error');
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
      if(res.ok){
        const resJson:Contact = await res.json()
        return resJson;
      }
      return null;
  }
  async setFavourite(id:string | number ) {
    if(typeof Swal !== 'undefined') {
        Swal.fire({
            title: 'Actualizando favorito...',
            allowOutsideClick: false,
            showConfirmButton: false,
            willOpen: () => { Swal.showLoading() }
        });
    }

    const res = await fetch(this.URL_BASE+"/"+id+"/favorite", 
      {
        method: "POST",
        headers: {
          Authorization: "Bearer "+this.authService.token,
        },
      });
    if(typeof Swal !== 'undefined') Swal.close();
    
    if(!res.ok) {
        if(typeof Swal !== 'undefined') Swal.fire('Error', 'No se pudo actualizar el favorito en la API.', 'error');
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