import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BidsToEvaluateComponent } from './bids-to-evaluate.component';

describe('BidsToEvaluateComponent', () => {
  let component: BidsToEvaluateComponent;
  let fixture: ComponentFixture<BidsToEvaluateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BidsToEvaluateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BidsToEvaluateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
