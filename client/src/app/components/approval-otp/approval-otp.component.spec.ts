import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalOtpComponent } from './approval-otp.component';

describe('ApprovalOtpComponent', () => {
  let component: ApprovalOtpComponent;
  let fixture: ComponentFixture<ApprovalOtpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovalOtpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
