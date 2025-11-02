import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RfpdetailsComponent } from './rfpdetails.component';

describe('RfpdetailsComponent', () => {
  let component: RfpdetailsComponent;
  let fixture: ComponentFixture<RfpdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RfpdetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RfpdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
