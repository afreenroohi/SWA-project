import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractPreparationFormComponent } from './contract-preparation-form.component';

describe('ContractPreparationFormComponent', () => {
  let component: ContractPreparationFormComponent;
  let fixture: ComponentFixture<ContractPreparationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractPreparationFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractPreparationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
