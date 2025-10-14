import { Component, inject, input } from '@angular/core';
import { Contact } from '../../interfaces/contacto';
import { ContactsService } from '../../services/contacts-service';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contact-list-item',
  standalone: true, 
  imports: [RouterModule],
  templateUrl: './contact-list-item.html',
  styleUrl: './contact-list-item.sass'
})
export class ContactListItem {
  index = input.required<number>();
  contacto = input.required<Contact>(); 

  contactsService = inject(ContactsService);
  
  isDeleting = false;
  async deleteContact() {
    if (this.isDeleting) return;
    if (typeof Swal !== 'undefined') {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "El contacto será eliminado permanentemente.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545', 
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, ¡Eliminar!',
            cancelButtonText: 'Cancelar'
        });

        if (!result.isConfirmed) {
            return; 
        }
        Swal.fire({
            title: 'Eliminando...',
            allowOutsideClick: false,
            showConfirmButton: false,
            willOpen: () => { Swal.showLoading(); }
        });
    }


    this.isDeleting = true;
    const success = await this.contactsService.deleteContact(this.contacto().id);
    this.isDeleting = false;

    if (!success) {
      console.error('Error al eliminar el contacto. Intenta nuevamente.');
    }
  }

  async toggleFavorite(event?: Event) { 
    if (event) event.stopPropagation(); 
    
    await this.contactsService.setFavourite(this.contacto().id);
  }
}