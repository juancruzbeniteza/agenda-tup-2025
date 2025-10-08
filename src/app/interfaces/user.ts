export interface User {
    Id: number,
    FirstName: string,
    LastName: string,
    Email: string,
}
export interface FormUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  password2: string;
}

export interface NewUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}