import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalApprovalComponent } from './final-approval.component';

describe('FinalApprovalComponent', () => {
  let component: FinalApprovalComponent;
  let fixture: ComponentFixture<FinalApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinalApprovalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
