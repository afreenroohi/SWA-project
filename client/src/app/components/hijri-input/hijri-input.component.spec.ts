import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HijriInputComponent } from './hijri-input.component';

describe('HijriInputComponent', () => {
  let component: HijriInputComponent;
  let fixture: ComponentFixture<HijriInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HijriInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HijriInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
