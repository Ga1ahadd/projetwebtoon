import { Component, OnInit } from '@angular/core';
import { WebtoonService } from 'app/services/webtoon.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  webtoons: any[] = [];
  page = 1;
  pageSize = 5;

  constructor(private webtoonService: WebtoonService) {}

  ngOnInit(): void {
    this.webtoonService.getAllObservable().subscribe((webtoons: any[]) => {
      this.webtoons = webtoons;
    });
  }

  get paginatedWebtoons(): any[] {
    const start = (this.page - 1) * this.pageSize;
    return this.webtoons.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.webtoons.length / this.pageSize);
  }

  changerPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.page = page;
    }
  }
}
