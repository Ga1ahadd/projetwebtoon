import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private apollo: Apollo) {}

  register(pseudo: string, email: string, mot_de_passe: string) {
    return this.apollo.mutate({
      mutation: gql`
        mutation Register($pseudo: String!, $email: String!, $mot_de_passe: String!) {
          register(pseudo: $pseudo, email: $email, mot_de_passe: $mot_de_passe) {
            id
            pseudo
            email
          }
        }
      `,
      variables: { pseudo, email, mot_de_passe }
    }).pipe(map((result: any) => result.data.register));
  }

  login(pseudo: string, mot_de_passe: string) {
    return this.apollo.mutate({
      mutation: gql`
        mutation Login($pseudo: String!, $mot_de_passe: String!) {
          login(pseudo: $pseudo, mot_de_passe: $mot_de_passe) {
            id
            pseudo
            email
            pieces
          }
        }
      `,
      variables: { pseudo, mot_de_passe }
    }).pipe(map((result: any) => result.data.login));
  }
}
