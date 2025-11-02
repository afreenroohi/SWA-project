import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LuhApprovalComponent } from './luh-approval.component';

describe('LuhApprovalComponent', () => {
  let component: LuhApprovalComponent;
  let fixture: ComponentFixture<LuhApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LuhApprovalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LuhApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
