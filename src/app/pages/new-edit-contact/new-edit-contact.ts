import { Component, inject, input, OnInit, viewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ContactsService } from '../../services/contacts-service';
import { Router } from '@angular/router';
import { Contact, NewContact } from '../../interfaces/contacto';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new-edit-contact',
  standalone: true, 
  imports: [FormsModule],
  templateUrl: './new-edit-contact.html',
  styleUrl: './new-edit-contact.sass'
})
export class NewEditContact implements OnInit {
  contactsService = inject(ContactsService);
  router = inject(Router)
  errorEnBack = false;
  isSubmitting: boolean = false; 

  idContacto = input<string>();
  contactoBack: Contact | undefined = undefined;
  form = viewChild<NgForm>("newContactForm")

  async ngOnInit() {
    if (this.idContacto()) {
      if (typeof Swal !== 'undefined') {
          Swal.fire({
              title: 'Cargando datos...',
              allowOutsideClick: false,
              showConfirmButton: false,
              willOpen: () => { Swal.showLoading(); }
          });
      }

      const contacto: Contact | null = await this.contactsService.getContactById(this.idContacto()!);
      
      if (typeof Swal !== 'undefined') Swal.close();
      
      if (contacto) {
        this.contactoBack = contacto;
      } else {
        if (typeof Swal !== 'undefined') {
             Swal.fire('Error', 'No se pudo cargar el contacto para editar.', 'error');
        }
        this.router.navigate(['/']); 
      }
    }
  }

  async handleFormSubmission(form: NgForm) {
    this.errorEnBack = false;
    
    if (form.invalid) return; 
    this.isSubmitting = true;
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            title: this.idContacto() ? 'Editando contacto...' : 'Creando contacto...',
            allowOutsideClick: false,
            showConfirmButton: false,
            willOpen: () => { Swal.showLoading(); }
        });
    }

    const nuevoContacto: NewContact = {
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      address: form.value.address,
      email: form.value.email,
      image: form.value.image,
      number: form.value.number,
      company: form.value.company,
      isFavorite: !!form.value.isFavorite
    }

    let res;
    if (this.idContacto()) {
      res = await this.contactsService.editContact({ ...nuevoContacto, id: this.contactoBack!.id });
    } else {
      res = await this.contactsService.createContact(nuevoContacto);
    }
    if (typeof Swal !== 'undefined') Swal.close();
  
    this.isSubmitting = false;
    if (!res) {
      this.errorEnBack = true;
      if (typeof Swal !== 'undefined') {
           Swal.fire('Error', 'Ocurrió un error al guardar los datos.', 'error');
      }
      return
    };
    if (typeof Swal !== 'undefined') {
        const action = this.idContacto() ? 'editado' : 'creado';
        Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: `El contacto ha sido ${action} correctamente.`,
            confirmButtonText: 'Continuar'
        });
    }
    
    this.router.navigate(["/contacts", res.id]);
  }
}