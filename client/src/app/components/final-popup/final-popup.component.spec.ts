import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalPopupComponent } from './final-popup.component';

describe('FinalPopupComponent', () => {
  let component: FinalPopupComponent;
  let fixture: ComponentFixture<FinalPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinalPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
