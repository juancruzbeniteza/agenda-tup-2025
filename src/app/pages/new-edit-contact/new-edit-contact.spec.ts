import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEditContact } from './new-edit-contact';

describe('NewEditContact', () => {
  let component: NewEditContact;
  let fixture: ComponentFixture<NewEditContact>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewEditContact]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewEditContact);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
