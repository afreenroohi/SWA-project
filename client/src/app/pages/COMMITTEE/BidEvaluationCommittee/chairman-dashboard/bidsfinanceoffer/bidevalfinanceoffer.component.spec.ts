import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BidEvalFinanceOfferComponent } from './bidevalfinanceoffer.component';

describe('BidsfinanceofferComponent', () => {
  let component: BidEvalFinanceOfferComponent;
  let fixture: ComponentFixture<BidEvalFinanceOfferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BidEvalFinanceOfferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BidEvalFinanceOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
