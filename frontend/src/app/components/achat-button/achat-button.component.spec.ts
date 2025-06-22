import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AchatButtonComponent } from './achat-button.component';

describe('AchatButtonComponent', () => {
  let component: AchatButtonComponent;
  let fixture: ComponentFixture<AchatButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AchatButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AchatButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
