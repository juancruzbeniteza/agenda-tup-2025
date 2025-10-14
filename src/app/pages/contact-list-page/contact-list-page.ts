import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ContactListItem } from '../../components/contact-list-item/contact-list-item';
import { Auth } from '../../services/auth';
import { ContactsService } from '../../services/contacts-service';
import { FormsModule } from '@angular/forms';
import { Contact } from '../../interfaces/contacto';


@Component({
  selector: 'app-contact-list-page',
  standalone: true, 
  imports: [RouterModule, ContactListItem, FormsModule],
  templateUrl: './contact-list-page.html',
  styleUrl: './contact-list-page.sass'
})
export class ContactListPage implements OnInit {
  authService = inject(Auth)
  contactsService = inject(ContactsService)
  isLoading: boolean = true; 

  ngOnInit(): void {
    this.loadContacts();
  }
  async loadContacts(): Promise<void> {
    this.isLoading = true; 
    
    await this.contactsService.getContacts();

    this.isLoading = false; 
  }
  protected getSortedContacts(): Contact[] {
    const contacts = [...this.contactsService.contacts];

    return contacts.sort((a, b) => {
      const favoriteOrder = (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0);
      
      if (favoriteOrder !== 0) {
        return favoriteOrder;
      }
      return a.firstName.localeCompare(b.firstName);
    });
  }
}
