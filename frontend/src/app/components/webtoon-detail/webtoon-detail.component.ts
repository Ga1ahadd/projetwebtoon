import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WebtoonService } from 'app/services/webtoon.service';

@Component({
  selector: 'app-webtoon-detail',
  templateUrl: './webtoon-detail.component.html',
  styleUrls: ['./webtoon-detail.component.scss']
})
export class WebtoonDetailComponent implements OnInit {
  webtoon: any;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private webtoonService: WebtoonService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('Webtoon ID from route:', id);
    if (id) {
      this.webtoonService.getOne(id).subscribe({
        next: (data) => {
          this.webtoon = data;
          this.loading = false;
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
}
