import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-webtoon-card',
  templateUrl: './webtoon-card.component.html',
  styleUrls: ['./webtoon-card.component.scss']
})
export class WebtoonCardComponent {
  @Input() webtoon: any;
}