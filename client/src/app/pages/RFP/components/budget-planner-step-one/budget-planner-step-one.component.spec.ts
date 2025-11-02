import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetPlannerStepOneComponent } from './budget-planner-step-one.component';

describe('BudgetPlannerStepOneComponent', () => {
  let component: BudgetPlannerStepOneComponent;
  let fixture: ComponentFixture<BudgetPlannerStepOneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BudgetPlannerStepOneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetPlannerStepOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
