import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalApproveComponent } from './final-approve.component';

describe('FinalApproveComponent', () => {
  let component: FinalApproveComponent;
  let fixture: ComponentFixture<FinalApproveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinalApproveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
