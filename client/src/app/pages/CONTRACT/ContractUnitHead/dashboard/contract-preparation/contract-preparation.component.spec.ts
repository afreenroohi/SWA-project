import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractPreparationComponent } from './contract-preparation.component';

describe('ContractPreparationComponent', () => {
  let component: ContractPreparationComponent;
  let fixture: ComponentFixture<ContractPreparationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractPreparationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractPreparationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
