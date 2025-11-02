import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalApproveCharimanComponent } from './final-approve-chariman.component';

describe('FinalApproveCharimanComponent', () => {
  let component: FinalApproveCharimanComponent;
  let fixture: ComponentFixture<FinalApproveCharimanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinalApproveCharimanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalApproveCharimanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
