import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetPlannerStepperComponent } from './budget-planner-stepper.component';

describe('BudgetPlannerStepperComponent', () => {
  let component: BudgetPlannerStepperComponent;
  let fixture: ComponentFixture<BudgetPlannerStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BudgetPlannerStepperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetPlannerStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
