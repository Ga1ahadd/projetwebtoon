import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebtoonCardComponent } from './webtoon-card.component';

describe('WebtoonCardComponent', () => {
  let component: WebtoonCardComponent;
  let fixture: ComponentFixture<WebtoonCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WebtoonCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WebtoonCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
