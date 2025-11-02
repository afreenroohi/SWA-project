import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BidEvaluationCommitteeComponent } from './bid-evaluation-committee.component';

describe('BidEvaluationCommitteeComponent', () => {
  let component: BidEvaluationCommitteeComponent;
  let fixture: ComponentFixture<BidEvaluationCommitteeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BidEvaluationCommitteeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BidEvaluationCommitteeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
