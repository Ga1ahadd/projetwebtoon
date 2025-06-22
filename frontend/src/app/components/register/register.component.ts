import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  pseudo: string = '';
  email: string = '';
  mot_de_passe: string = '';
  error: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.register(this.pseudo, this.email, this.mot_de_passe).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error(err);
        const msg = err?.message || '';
        this.error = msg.includes('pseudo')
          ? 'Pseudo déjà pris'
          : msg.includes('email')
          ? 'Email déjà utilisé'
          : 'Erreur lors de l’inscription';
      }
    });
  }
}
