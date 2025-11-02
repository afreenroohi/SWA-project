import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BidsWithEvalCommitteeComponent } from './bids-with-eval-committee.component';

describe('BidsWithEvalCommitteeComponent', () => {
  let component: BidsWithEvalCommitteeComponent;
  let fixture: ComponentFixture<BidsWithEvalCommitteeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BidsWithEvalCommitteeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BidsWithEvalCommitteeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
