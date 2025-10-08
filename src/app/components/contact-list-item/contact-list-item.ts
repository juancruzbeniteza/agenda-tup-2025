import { Component, inject, input } from '@angular/core';
import { Contact } from '../../interfaces/contacto';
import { ContactsService } from '../../services/contacts-service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-contact-list-item',
  imports: [RouterModule],
  templateUrl: './contact-list-item.html',
  styleUrl: './contact-list-item.sass'
})
export class ContactListItem {
  index = input.required<number>();
  contacto = input.required<Contact>();

  contactsService = inject(ContactsService);
  
  isDeleting = false;
  isTogglingFavorite = false;

  /** Elimina el contacto con confirmación */
  async deleteContact() {
    if (this.isDeleting) return;

    this.isDeleting = true;
    const success = await this.contactsService.deleteContact(this.contacto().id);
    this.isDeleting = false;

    if (!success) {
      alert('Error al eliminar el contacto. Intenta nuevamente.');
    }
  }

  /** Alterna el estado de favorito del contacto */
  async toggleFavorite() {
    if (this.isTogglingFavorite) return;

    this.isTogglingFavorite = true;
    const success = await this.contactsService.toggleFavorite(this.contacto().id);
    this.isTogglingFavorite = false;

    if (!success) {
      alert('Error al actualizar favorito. Intenta nuevamente.');
    }
  }
}