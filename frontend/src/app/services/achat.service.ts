// src/app/services/achat.service.ts
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AchatService {
  constructor(private apollo: Apollo) {}

  acheterChapitre(webtoonId: string, numero_chapitre: number) {
    return this.apollo.mutate({
      mutation: gql`
        mutation($webtoonId: ID!, $numero_chapitre: Int!) {
          acheterChapitre(webtoonId: $webtoonId, numero_chapitre: $numero_chapitre) {
            id
            numero_chapitre
            createdAt
          }
        }
      `,
      variables: { webtoonId, numero_chapitre }
    }).pipe(map((res: any) => res.data.acheterChapitre));
  }

  getMesAchats() {
    return this.apollo.query({
        query: gql`
        query {
            mesAchats {
            id
            numero_chapitre
            createdAt
            webtoon {
                id
                titre
            }
            }
        }
        `,
        fetchPolicy: 'no-cache'
    }).pipe(map((res: any) => res.data.mesAchats));
    }

}
