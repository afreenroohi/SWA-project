import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractManagerDetailsComponent } from './contract-manager-details.component';

describe('ContractManagerDetailsComponent', () => {
  let component: ContractManagerDetailsComponent;
  let fixture: ComponentFixture<ContractManagerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractManagerDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractManagerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
