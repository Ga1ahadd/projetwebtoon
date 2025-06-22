import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WebtoonService {
  private webtoonsSubject = new BehaviorSubject<any[]>([]);
  private webtoonsLoaded = false;

  constructor(private apollo: Apollo) {}

  getAll(forceRefresh: boolean = false) {
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
            auteur
          }
        }
      `,
      fetchPolicy: forceRefresh ? 'network-only' : 'cache-first'
    }).pipe(
      map((res: any) => {
        const data = res.data.webtoons;
        this.webtoonsSubject.next(data);
        this.webtoonsLoaded = true;
        return data;
      })
    );
  }

  getAllObservable() {
    if (!this.webtoonsLoaded) {
      this.getAll(true).subscribe(); // force initial chargement
    }
    return this.webtoonsSubject.asObservable();
  }

  ajouterWebtoon(input: {
    titre: string;
    resume?: string;
    genre?: string;
    nb_chapitres: number;
    nb_chapitres_gratuits: number;
    auteur: string;
    image?: string;
  }) {
    return this.apollo.mutate({
      mutation: gql`
        mutation AjouterWebtoon(
          $titre: String!,
          $resume: String,
          $genre: String,
          $nb_chapitres: Int!,
          $nb_chapitres_gratuits: Int!,
          $auteur: String!,
          $image: String
        ) {
          ajouterWebtoon(
            titre: $titre,
            resume: $resume,
            genre: $genre,
            nb_chapitres: $nb_chapitres,
            nb_chapitres_gratuits: $nb_chapitres_gratuits,
            auteur: $auteur,
            image: $image
          ) {
            id
            titre
            genre
            image
            auteur
            nb_chapitres
            nb_chapitres_gratuits
          }
        }
      `,
      variables: input
    }).pipe(
      map((res: any) => {
        const nouveau = res.data.ajouterWebtoon;
        const courants = this.webtoonsSubject.value;
        this.webtoonsSubject.next([nouveau, ...courants]);
        return nouveau;
      })
    );
  }

  supprimerWebtoon(id: string) {
    return this.apollo.mutate({
      mutation: gql`
        mutation SupprimerWebtoon($id: ID!) {
          supprimerWebtoon(id: $id)
        }
      `,
      variables: { id }
    }).pipe(
      map((res: any) => {
        if (res.data.supprimerWebtoon) {
          const miseAJour = this.webtoonsSubject.value.filter(w => w.id !== id);
          this.webtoonsSubject.next(miseAJour);
        }
        return res.data.supprimerWebtoon;
      })
    );
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
            auteur
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

  modifierWebtoon(id: string, updates: any) {
    return this.apollo.mutate({
      mutation: gql`
        mutation ModifierWebtoon(
          $id: ID!,
          $titre: String,
          $resume: String,
          $genre: String,
          $nb_chapitres: Int,
          $nb_chapitres_gratuits: Int,
          $auteur: String,
          $image: String
        ) {
          modifierWebtoon(
            id: $id,
            titre: $titre,
            resume: $resume,
            genre: $genre,
            nb_chapitres: $nb_chapitres,
            nb_chapitres_gratuits: $nb_chapitres_gratuits,
            auteur: $auteur,
            image: $image
          ) {
            id
            titre
            genre
            auteur
            nb_chapitres
            nb_chapitres_gratuits
            image
          }
        }
      `,
      variables: { id, ...updates }
    }).pipe(map((res: any) => res.data.modifierWebtoon));
  }

}
