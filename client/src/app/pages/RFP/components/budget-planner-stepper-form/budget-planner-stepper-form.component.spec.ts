import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetPlannerStepperFormComponent } from './budget-planner-stepper-form.component';

describe('BudgetPlannerStepperFormComponent', () => {
  let component: BudgetPlannerStepperFormComponent;
  let fixture: ComponentFixture<BudgetPlannerStepperFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BudgetPlannerStepperFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetPlannerStepperFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
