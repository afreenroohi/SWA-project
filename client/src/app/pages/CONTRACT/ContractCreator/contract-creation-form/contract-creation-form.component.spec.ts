import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractCreationFormComponent } from './contract-creation-form.component';

describe('ContractCreationFormComponent', () => {
  let component: ContractCreationFormComponent;
  let fixture: ComponentFixture<ContractCreationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractCreationFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractCreationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
