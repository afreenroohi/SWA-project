import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BidsFromFinanceComponent } from './bids-from-finance.component';

describe('BidsFromFinanceComponent', () => {
  let component: BidsFromFinanceComponent;
  let fixture: ComponentFixture<BidsFromFinanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BidsFromFinanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BidsFromFinanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
