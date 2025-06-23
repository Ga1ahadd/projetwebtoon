import { Component, OnInit } from '@angular/core';
import { WebtoonService } from 'app/services/webtoon.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  allWebtoons: any[] = [];
  filteredWebtoons: any[] = [];
  genresDisponibles: string[] = [];
  filtreTitre: string = '';
  filtreGenre: string = '';

  page = 1;
  pageSize = 5;

  constructor(private webtoonService: WebtoonService) {}

  ngOnInit(): void {
    this.webtoonService.getAllObservable().subscribe((webtoons: any[]) => {
      this.allWebtoons = webtoons;
      this.filteredWebtoons = webtoons;
      this.genresDisponibles = [...new Set(webtoons.map(w => w.genre))];
    });
  }

  filtrerWebtoons(): void {
    this.page = 1;
    this.filteredWebtoons = this.allWebtoons.filter(w => {
      const correspondTitre = this.filtreTitre === '' || w.titre.toLowerCase().includes(this.filtreTitre.toLowerCase());
      const correspondGenre = this.filtreGenre === '' || w.genre === this.filtreGenre;
      return correspondTitre && correspondGenre;
    });
  }

  get paginatedWebtoons(): any[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredWebtoons.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredWebtoons.length / this.pageSize);
  }

  changerPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.page = page;
    }
  }
}
