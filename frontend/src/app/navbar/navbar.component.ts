import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  constructor(public authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  get isLoggedIn(): boolean {
    return !!this.authService.getUser();
  }

  get isAdmin(): boolean {
    const user = this.authService.getUser();
    return user?.role === 'admin';
  }

  get pseudo(): string {
    return this.authService.getUser()?.pseudo || '';
  }
}
