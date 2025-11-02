import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveContractCHComponent } from './approve-contract-ch.component';

describe('ApproveContractCHComponent', () => {
  let component: ApproveContractCHComponent;
  let fixture: ComponentFixture<ApproveContractCHComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveContractCHComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveContractCHComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
