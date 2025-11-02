import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractAssignmentComponent } from './contract-assignment.component';

describe('ContractAssignmentComponent', () => {
  let component: ContractAssignmentComponent;
  let fixture: ComponentFixture<ContractAssignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractAssignmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
