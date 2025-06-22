import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser: any = null;

  constructor(private apollo: Apollo) {}

  register(pseudo: string, email: string, mot_de_passe: string) {
    return this.apollo.mutate({
      mutation: gql`
        mutation Register($pseudo: String!, $email: String!, $mot_de_passe: String!) {
          register(pseudo: $pseudo, email: $email, mot_de_passe: $mot_de_passe) {
            id
            pseudo
            email
            role
            pieces
          }
        }
      `,
      variables: { pseudo, email, mot_de_passe }
    }).pipe(
      map((res: any) => {
        this.currentUser = res.data.register;
        localStorage.setItem('user', JSON.stringify(this.currentUser));
        return this.currentUser;
      })
    );
  }

  login(pseudo: string, mot_de_passe: string) {
    return this.apollo.mutate({
      mutation: gql`
        mutation Login($pseudo: String!, $mot_de_passe: String!) {
          login(pseudo: $pseudo, mot_de_passe: $mot_de_passe) {
            id
            pseudo
            email
            role
            pieces
          }
        }
      `,
      variables: { pseudo, mot_de_passe }
    }).pipe(
      map((res: any) => {
        this.currentUser = res.data.login;
        localStorage.setItem('user', JSON.stringify(this.currentUser));
        return this.currentUser;
      })
    );
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('user');
  }

  getUser() {
    if (this.currentUser) return this.currentUser;
    const stored = localStorage.getItem('user');
    if (stored) {
      this.currentUser = JSON.parse(stored);
    }
    return this.currentUser;
  }
}
