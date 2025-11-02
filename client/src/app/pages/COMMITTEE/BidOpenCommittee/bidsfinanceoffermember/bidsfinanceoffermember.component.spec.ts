import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BidsFinanceOfferMemberComponent } from './bidsfinanceoffermember.component';

describe('BidsFinanceOfferMemberComponent', () => {
  let component: BidsFinanceOfferMemberComponent;
  let fixture: ComponentFixture<BidsFinanceOfferMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BidsFinanceOfferMemberComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BidsFinanceOfferMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
