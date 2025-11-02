import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetPlannerBOQTabelComponent } from './budget-planner-boq-tabel.component';

describe('BudgetPlannerBOQTabelComponent', () => {
  let component: BudgetPlannerBOQTabelComponent;
  let fixture: ComponentFixture<BudgetPlannerBOQTabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BudgetPlannerBOQTabelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetPlannerBOQTabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
