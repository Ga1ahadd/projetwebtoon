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
  afficherPopupAjout = false;

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

  webtoonEnEdition: any = null;
  afficherPopupEdition = false;

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
    this.webtoonService.getAll().subscribe((res: any[]) => {
      this.webtoons = [...res].sort((a: any, b: any) => a.titre.localeCompare(b.titre));
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
          this.webtoons = [...[newWebtoon, ...this.webtoons]].sort((a: any, b: any) => a.titre.localeCompare(b.titre));
          this.highlightedId = newWebtoon.id;

          this.message = 'Webtoon ajouté';
          this.messageType = 'success';
          this.clearHighlight();
        } else {
          this.message = 'Erreur lors de l\'ajout : données incomplètes';
          this.messageType = 'error';
        }
        this.viderFormulaire();
        this.afficherPopupAjout = false;
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
    this.webtoonEnEdition = { ...webtoon };
    this.afficherPopupEdition = true;
  }

  validerModification() {
    const { id, ...modifs } = this.webtoonEnEdition;
    this.webtoonService.modifierWebtoon(id, modifs).subscribe({
      next: (updated) => {
        const index = this.webtoons.findIndex(w => w.id === updated.id);
        if (index !== -1) {
          this.webtoons[index] = updated;
          this.webtoons = [...this.webtoons].sort((a: any, b: any) => a.titre.localeCompare(b.titre));
        }

        this.message = 'Webtoon modifié';
        this.messageType = 'success';
        this.afficherPopupEdition = false;
        this.clearMessage();
        this.highlightedId = updated.id;
        this.clearHighlight();
      },
      error: () => {
        this.message = 'Erreur lors de la modification.';
        this.messageType = 'error';
        this.clearMessage();
      }
    });
  }

  annulerModification() {
    this.webtoonEnEdition = null;
    this.afficherPopupEdition = false;
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
