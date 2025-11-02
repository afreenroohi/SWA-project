import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BidsfinanceofferComponent } from './bidsfinanceoffer.component';

describe('BidsfinanceofferComponent', () => {
  let component: BidsfinanceofferComponent;
  let fixture: ComponentFixture<BidsfinanceofferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BidsfinanceofferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BidsfinanceofferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
