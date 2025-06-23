import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WebtoonService } from 'app/services/webtoon.service';
import { AchatService } from 'app/services/achat.service';
import { Apollo, gql } from 'apollo-angular';

@Component({
  selector: 'app-webtoon-detail',
  templateUrl: './webtoon-detail.component.html',
  styleUrls: ['./webtoon-detail.component.scss']
})
export class WebtoonDetailComponent implements OnInit {
  webtoon: any;
  loading = true;
  error: string | null = null;
  achatsEffectues: number[] = [];

  constructor(
    private route: ActivatedRoute,
    private webtoonService: WebtoonService,
    private achatService: AchatService,
    private apollo: Apollo
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.webtoonService.getOne(id).subscribe({
        next: (data) => {
          this.webtoon = data;
          this.loading = false;
          this.loadAchats();
        },
        error: (err) => {
          console.error(err);
          this.error = 'Impossible de charger le webtoon.';
          this.loading = false;
        }
      });
    } else {
      this.error = 'Aucun ID trouvé dans l’URL.';
      this.loading = false;
    }
  }

  loadAchats() {
    this.apollo.query({
      query: gql`
        query($webtoonId: ID!) {
          achatsParWebtoon(webtoonId: $webtoonId)
        }
      `,
      variables: { webtoonId: this.webtoon.id },
      fetchPolicy: 'no-cache'
    }).subscribe({
      next: (res: any) => {
        this.achatsEffectues = res.data.achatsParWebtoon;
      },
      error: () => {
        console.warn("Échec du chargement des achats");
      }
    });
  }

  acheter(numero: number) {
    this.achatService.acheterChapitre(this.webtoon.id, numero).subscribe({
      next: () => {
        alert("Chapitre acheté avec succès !");
        this.achatsEffectues.push(numero);
      },
      error: (err) => {
        alert(err.message || "Erreur lors de l'achat");
      }
    });
  }
}
