import { Routes } from '@angular/router';
import { LoginPage } from './pages/login/login';
import { ContactListPage } from './pages/contact-list-page/contact-list-page';
import { ContactDetailsPage } from './pages/contact-details-page/contact-details-page';
import { LoggedLayout } from './layouts/logged-layout/logged-layout';
import { RegisterPage } from './pages/register-page/register-page';
import { onlyPublicGuard } from './guards/only-public-guard-guard';
import { onlyUserGuard } from './guards/only-user-guard-guard';
import { NewEditContact } from './pages/new-edit-contact/new-edit-contact';
import { GroupsListPage } from './pages/group-list-page/group-list-page';

export const routes: Routes = [
    {
        path:"login",
        component: LoginPage,
        canActivate: [onlyPublicGuard]
    },
    {
        path:"register",
        component: RegisterPage,
        canActivate: [onlyPublicGuard]
    },
    {
        path:"",
        component: LoggedLayout,
        canActivateChild: [onlyUserGuard],
        children: [
            {
                path:"",
                component: ContactListPage
            },
            {
                path:"contacts/new",
                component: NewEditContact
            },
            { path: "contacts/:idContacto/edit",
                component: NewEditContact
            }, {
                path: "groups",
                component: GroupsListPage
            }, {
                path: "contacts/:id",
                component: ContactDetailsPage
            },
        ]
    },
];
