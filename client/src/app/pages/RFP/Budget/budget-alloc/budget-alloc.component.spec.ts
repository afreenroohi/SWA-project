import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetAllocComponent } from './budget-alloc.component';

describe('BudgetAllocComponent', () => {
  let component: BudgetAllocComponent;
  let fixture: ComponentFixture<BudgetAllocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BudgetAllocComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetAllocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
