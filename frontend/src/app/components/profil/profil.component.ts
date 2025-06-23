import { Component, OnInit } from '@angular/core';
import { UserService } from 'app/services/user.service';
import { AuthService } from 'app/services/auth.service';
import { AchatService } from 'app/services/achat.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {
  user: any;
  montantAPayer: number = 0;
  message: string = '';
  messageType: 'success' | 'error' = 'success';
  achats: any[] = [];

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private achatService: AchatService
  ) {}

  ngOnInit(): void {
    this.chargerUtilisateurEtAchats();
  }

  chargerUtilisateurEtAchats() {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.user = user;

        this.achatService.getMesAchats().subscribe({
          next: (res) => {
            this.achats = res;
          },
          error: () => {
            this.message = 'Erreur lors du chargement des achats.';
            this.messageType = 'error';
          }
        });
      },
      error: () => {
        this.message = 'Erreur lors du chargement du profil.';
        this.messageType = 'error';
      }
    });
  }

  ajouterPieces() {
    if (this.montantAPayer <= 0) {
      this.message = 'Montant invalide.';
      this.messageType = 'error';
      return;
    }

    this.userService.ajouterPieces(this.montantAPayer).subscribe({
      next: () => {
        this.message = 'Pièces ajoutées avec succès.';
        this.messageType = 'success';
        this.montantAPayer = 0;

        this.chargerUtilisateurEtAchats();

        setTimeout(() => this.message = '', 3000);
      },
      error: () => {
        this.message = 'Erreur lors de l’ajout de pièces.';
        this.messageType = 'error';
        setTimeout(() => this.message = '', 3000);
      }
    });
  }
}
