import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private apollo: Apollo) {}

  me() {
    return this.apollo.query({
      query: gql`
        query {
          me {
            id
            pseudo
            email
            pieces
          }
        }
      `,
      fetchPolicy: 'network-only'
    }).pipe(map((res: any) => res.data.me));
  }

  ajouterPieces(montant: number) {
    return this.apollo.mutate({
      mutation: gql`
        mutation AjouterPieces($montant: Int!) {
          ajouterPieces(montant: $montant) {
            id
            pieces
          }
        }
      `,
      variables: { montant }
    }).pipe(map((res: any) => res.data.ajouterPieces));
  }


  mesAchats() {
    return this.apollo.query({
      query: gql`
        query {
          mesAchats {
            id
            webtoon {
              titre
              id
            }
            numero_chapitre
            createdAt
          }
        }
      `
    }).pipe(map((res: any) => res.data.mesAchats));
  }

  getCurrentUser() {
    return this.apollo.query({
      query: gql`
        query {
          me {
            id
            pseudo
            email
            role
            pieces
          }
        }
      `,
      fetchPolicy: 'network-only'
    }).pipe(map((res: any) => res.data.me));
  }

}
