import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RfpRmiComponent } from './rfp-rmi.component';

describe('RfpRmiComponent', () => {
  let component: RfpRmiComponent;
  let fixture: ComponentFixture<RfpRmiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RfpRmiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RfpRmiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
