import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class WebtoonService {
  constructor(private apollo: Apollo) {}

  getAll() {
    return this.apollo.query({
      query: gql`
        query {
          webtoons {
            id
            titre
            genre
            nb_chapitres
            nb_chapitres_gratuits
            image
            auteur {
              nom
            }
          }
        }
      `
    }).pipe(map((res: any) => res.data.webtoons));
  }

  getOne(id: string) {
    return this.apollo.query({
      query: gql`
        query GetWebtoon($id: ID!) {
          webtoon(id: $id) {
            id
            titre
            resume
            genre
            nb_chapitres
            nb_chapitres_gratuits
            image
            auteur {
              nom
            }
          }
        }
      `,
      variables: { id }
    }).pipe(map((res: any) => res.data.webtoon));
  }

  acheterChapitre(webtoonId: string, numero_chapitre: number) {
    return this.apollo.mutate({
      mutation: gql`
        mutation AcheterChapitre($webtoonId: ID!, $numero_chapitre: Int!) {
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
}
