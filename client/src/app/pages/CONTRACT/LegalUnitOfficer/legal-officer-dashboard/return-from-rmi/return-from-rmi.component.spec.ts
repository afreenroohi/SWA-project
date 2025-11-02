import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnFromRmiComponent } from './return-from-rmi.component';

describe('ReturnFromRmiComponent', () => {
  let component: ReturnFromRmiComponent;
  let fixture: ComponentFixture<ReturnFromRmiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReturnFromRmiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnFromRmiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
