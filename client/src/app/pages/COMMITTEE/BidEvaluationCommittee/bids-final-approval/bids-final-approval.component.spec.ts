import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BidsFinalApprovalComponent } from './bids-final-approval.component';

describe('BidsFinalApprovalComponent', () => {
  let component: BidsFinalApprovalComponent;
  let fixture: ComponentFixture<BidsFinalApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BidsFinalApprovalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BidsFinalApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
