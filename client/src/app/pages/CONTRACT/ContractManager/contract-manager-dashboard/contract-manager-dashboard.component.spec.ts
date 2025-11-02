import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractManagerDashboardComponent } from './contract-manager-dashboard.component';

describe('ContractManagerDashboardComponent', () => {
  let component: ContractManagerDashboardComponent;
  let fixture: ComponentFixture<ContractManagerDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractManagerDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractManagerDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
