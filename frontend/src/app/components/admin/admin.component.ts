import { Component, OnInit } from '@angular/core';
import { WebtoonService } from 'app/services/webtoon.service';
import { AuthService } from 'app/services/auth.service';
import { Router } from '@angular/router';
import { GENRES } from 'app/constants/genres';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  webtoons: any[] = [];
  afficherFormulaireAjout = false;

  genres = GENRES;
  titre = '';
  resume = '';
  genre = '';
  nb_chapitres = 0;
  nb_chapitres_gratuits = 0;
  auteur = '';
  image = '';

  message: string = '';
  messageType: 'success' | 'error' | '' = '';

  highlightedId: string | null = null;

  constructor(
    private webtoonService: WebtoonService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (!user || user.role !== 'admin') {
      this.router.navigate(['/']);
    } else {
      this.chargerWebtoons();
    }
  }

  chargerWebtoons() {
    this.webtoonService.getAll().subscribe((res) => {
      this.webtoons = res;
    });
  }

  ajouterWebtoon() {
    this.webtoonService.ajouterWebtoon({
      titre: this.titre,
      resume: this.resume,
      genre: this.genre,
      nb_chapitres: this.nb_chapitres,
      nb_chapitres_gratuits: this.nb_chapitres_gratuits,
      auteur: this.auteur,
      image: this.image
    }).subscribe({
      next: (newWebtoon) => {
        if (newWebtoon?.titre) {
          this.webtoons = [newWebtoon, ...this.webtoons];
          this.highlightedId = newWebtoon.id;

          this.message = 'Webtoon ajouté';
          this.messageType = 'success';
          this.clearHighlight();
        } else {
          this.message = 'Erreur lors de l\'ajout : données incomplètes';
          this.messageType = 'error';
        }
        this.viderFormulaire();
        this.afficherFormulaireAjout = false;
        this.clearMessage();
      },
      error: () => {
        this.message = 'Erreur lors de l\'ajout du webtoon.';
        this.messageType = 'error';
        this.clearMessage();
      }
    });
  }

  supprimerWebtoon(id: string) {
    const confirmation = confirm('Êtes-vous sûr(e) de vouloir supprimer ce webtoon ?');
    if (!confirmation) return;

    this.webtoonService.supprimerWebtoon(id).subscribe({
      next: () => {
        this.webtoons = this.webtoons.filter(w => w.id !== id);
        this.message = 'Webtoon supprimé';
        this.messageType = 'success';
        this.clearMessage();
      },
      error: () => {
        this.message = 'Erreur lors de la suppression.';
        this.messageType = 'error';
        this.clearMessage();
      }
    });
  }

  modifierWebtoon(webtoon: any) {
    alert(`Modifier "${webtoon.titre}" – à faire plus tard`);
  }

  viderFormulaire() {
    this.titre = '';
    this.resume = '';
    this.genre = '';
    this.nb_chapitres = 0;
    this.nb_chapitres_gratuits = 0;
    this.auteur = '';
    this.image = '';
  }

  clearMessage() {
    setTimeout(() => {
      this.message = '';
      this.messageType = '';
    }, 3000);
  }

  clearHighlight() {
    setTimeout(() => {
      this.highlightedId = null;
    }, 3000);
  }
}
