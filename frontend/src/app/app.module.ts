import { NgModule, inject } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { Apollo, provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HomeComponent } from './components/home/home.component';
import { WebtoonCardComponent } from './components/webtoon-card/webtoon-card.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { WebtoonDetailComponent } from './components/webtoon-detail/webtoon-detail.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ProfilComponent } from './components/profil/profil.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AdminComponent } from './components/admin/admin.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    WebtoonCardComponent,
    LoginComponent,
    RegisterComponent,
    WebtoonDetailComponent,
    NavbarComponent,
    ProfilComponent,
    AdminComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    provideApollo(() => {
      const httpLink = inject(HttpLink);

      const authLink = setContext((_, { headers }) => {
        const token = localStorage.getItem('token');
        return {
          headers: {
            ...headers,
            Authorization: token ? `Bearer ${token}` : ''
          }
        };
      });

      return {
        cache: new InMemoryCache(),
        link: authLink.concat(httpLink.create({ uri: 'http://localhost:4000/graphql' }))
      };
    }),
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
