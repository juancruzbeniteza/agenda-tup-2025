import { inject, Injectable } from '@angular/core';
import { Contact, NewContact } from '../interfaces/contacto';
import { Auth } from './auth';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  authService = inject(Auth);
  readonly URL_BASE = "https://agenda-api.somee.com/api/Contacts";

  /** Lista de contactos en memoria */
  contacts: Contact[] = [];

  /** Crea un contacto */
  async createContact(nuevoContacto: NewContact) {
    // Asegurar que isFavorite sea un boolean
    const contactToSend = {
      ...nuevoContacto,
      isFavorite: !!nuevoContacto.isFavorite // Convierte a boolean explícitamente
    };

    console.log('Creating contact with data:', contactToSend);

    const res = await fetch(this.URL_BASE, 
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.authService.token,
        },
        body: JSON.stringify(contactToSend)
      });
    
    if (!res.ok) {
      console.error('Error creating contact:', res.status, await res.text());
      return;
    }
    
    const resContact: Contact = await res.json();
    console.log('Contact created successfully:', resContact);
    this.contacts.push(resContact);
    return resContact;
  }

  /** Elimina un contacto según su ID */
  async deleteContact(id: number) {
    try {
      const res = await fetch(`${this.URL_BASE}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + this.authService.token,
        }
      });
      
      if (res.ok) {
        // Solo eliminar de la lista local si la eliminación en el servidor fue exitosa
        this.contacts = this.contacts.filter(contacto => contacto.id !== id);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error al eliminar contacto:', error);
      return false;
    }
  }

  /** Edita un contacto */
  async editContact(contact: Contact) {
    // Asegurar que isFavorite sea un boolean
    const contactToSend = {
      ...contact,
      isFavorite: !!contact.isFavorite // Convierte a boolean explícitamente
    };

    console.log('Editing contact with data:', contactToSend);

    const res = await fetch(this.URL_BASE + "/" + contact.id, 
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.authService.token,
        },
        body: JSON.stringify(contactToSend)
      });
    
    if (!res.ok) {
      console.error('Error editing contact:', res.status, await res.text());
      return;
    }

    console.log('Contact edited successfully');
    
    /** Actualizo la lista de contactos locales para dejar el contacto actualizado */
    this.contacts = this.contacts.map(oldContact => {
      if (oldContact.id === contact.id) return contactToSend;
      return oldContact
    })
    return contactToSend;
  }

  /** Alterna el estado de favorito de un contacto */
  async toggleFavorite(contactId: number) {
    const contact = this.contacts.find(c => c.id === contactId);
    if (!contact) {
      console.error('Contact not found:', contactId);
      return false;
    }

    console.log('Original contact:', contact);
    
    // Crear una copia del contacto con el estado de favorito alternado
    const updatedContact: Contact = {
      ...contact,
      isFavorite: !contact.isFavorite
    };

    console.log('Updated contact to send:', updatedContact);

    // Intentar actualizar en el servidor usando la URL correcta
    try {
      const res = await fetch(`https://agenda-api.somee.com/api/Contacts/${contact.id}`, 
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + this.authService.token,
          },
          body: JSON.stringify(updatedContact)
        });
      
      console.log('API Response status:', res.status);
      
      if (res.ok || res.status === 204) { // 204 también es éxito (No Content)
        // Actualizar la lista local
        this.contacts = this.contacts.map(oldContact => {
          if (oldContact.id === contact.id) return updatedContact;
          return oldContact
        });
        console.log('Local contacts updated');
        return true;
      } else {
        const errorText = await res.text();
        console.error('API Error:', errorText);
        return false;
      }
    } catch (error) {
      console.error('Network error:', error);
      return false;
    }
  }

  /** Obtiene los contactos del backend */
  async getContacts() {
    const res = await fetch(this.URL_BASE,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + this.authService.token
        }
      })
    if (res.ok) {
      const resJson: Contact[] = await res.json()
      this.contacts = resJson;
    }
  }

  /** Obtiene un contacto del backend */
  async getContactById(id: string | number) {
    const res = await fetch(this.URL_BASE + "/" + id,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + this.authService.token
        }
      })
    if (res.ok) {
      const resJson: Contact = await res.json()
      return resJson;
    }
    return null;
  }
}