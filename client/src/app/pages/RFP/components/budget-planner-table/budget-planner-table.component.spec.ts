import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetPlannerTableComponent } from './budget-planner-table.component';

describe('BudgetPlannerTableComponent', () => {
  let component: BudgetPlannerTableComponent;
  let fixture: ComponentFixture<BudgetPlannerTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BudgetPlannerTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetPlannerTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
