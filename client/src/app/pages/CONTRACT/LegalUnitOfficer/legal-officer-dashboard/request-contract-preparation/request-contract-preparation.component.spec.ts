import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestContractPreparationComponent } from './request-contract-preparation.component';

describe('RequestContractPreparationComponent', () => {
  let component: RequestContractPreparationComponent;
  let fixture: ComponentFixture<RequestContractPreparationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestContractPreparationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestContractPreparationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
