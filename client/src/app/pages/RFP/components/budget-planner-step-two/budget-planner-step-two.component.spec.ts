import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetPlannerStepTwoComponent } from './budget-planner-step-two.component';

describe('BudgetPlannerStepTwoComponent', () => {
  let component: BudgetPlannerStepTwoComponent;
  let fixture: ComponentFixture<BudgetPlannerStepTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BudgetPlannerStepTwoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetPlannerStepTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
