import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RfpManagerDetailsComponent } from './rfp-manager-details.component';

describe('RfpManagerDetailsComponent', () => {
  let component: RfpManagerDetailsComponent;
  let fixture: ComponentFixture<RfpManagerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RfpManagerDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RfpManagerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
