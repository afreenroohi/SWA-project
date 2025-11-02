import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnFromApprovalComponent } from './return-from-approval.component';

describe('ReturnFromApprovalComponent', () => {
  let component: ReturnFromApprovalComponent;
  let fixture: ComponentFixture<ReturnFromApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReturnFromApprovalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnFromApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
