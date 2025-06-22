import { Component, OnInit } from '@angular/core';
import { WebtoonService } from 'app/services/webtoon.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  webtoons: any[] = [];

  constructor(private webtoonService: WebtoonService) {}

  ngOnInit(): void {
    this.webtoonService.getAll().subscribe((webtoons) => {
      this.webtoons = webtoons;
    });
  }
}
