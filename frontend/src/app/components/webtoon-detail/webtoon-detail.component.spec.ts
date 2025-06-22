import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebtoonDetailComponent } from './webtoon-detail.component';

describe('WebtoonDetailComponent', () => {
  let component: WebtoonDetailComponent;
  let fixture: ComponentFixture<WebtoonDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WebtoonDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WebtoonDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
