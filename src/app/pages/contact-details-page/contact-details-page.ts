import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ContactsService } from '../../services/contacts-service';
import { Contact } from '../../interfaces/contacto';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contact-details-page',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './contact-details-page.html',
  styleUrl: './contact-details-page.sass'
})
export class ContactDetailsPage implements OnInit { 
  contacto?: Contact;
  
  private route = inject(ActivatedRoute); 
  private contactsService = inject(ContactsService);

  async ngOnInit() {
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            title: 'Cargando contacto...',
            allowOutsideClick: false,
            showConfirmButton: false,
            willOpen: () => { Swal.showLoading(); }
        });
    }
    const id = Number(this.route.snapshot.paramMap.get('id')); 
    
    this.contacto = this.contactsService.contacts.find(c => c.id === id);
    if (!this.contacto) {
        const foundContact = await this.contactsService.getContactById(id);
        this.contacto = foundContact === null ? undefined : foundContact;
    }
    if (typeof Swal !== 'undefined') Swal.close();
    
    if (!this.contacto) {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'El contacto solicitado no fue encontrado.',
            }).then(() => {
            });
        }
    }
  }
}