import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BidsToBeEvaluatedComponent } from './bids-to-be-evaluated.component';

describe('BidsToBeEvaluatedComponent', () => {
  let component: BidsToBeEvaluatedComponent;
  let fixture: ComponentFixture<BidsToBeEvaluatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BidsToBeEvaluatedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BidsToBeEvaluatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
