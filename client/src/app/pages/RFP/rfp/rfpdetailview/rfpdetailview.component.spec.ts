import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RfpdetailviewComponent } from './rfpdetailview.component';

describe('RfpdetailviewComponent', () => {
  let component: RfpdetailviewComponent;
  let fixture: ComponentFixture<RfpdetailviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RfpdetailviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RfpdetailviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
