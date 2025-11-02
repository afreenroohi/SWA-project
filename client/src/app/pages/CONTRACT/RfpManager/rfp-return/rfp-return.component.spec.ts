import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RfpReturnComponent } from './rfp-return.component';

describe('RfpReturnComponent', () => {
  let component: RfpReturnComponent;
  let fixture: ComponentFixture<RfpReturnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RfpReturnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RfpReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
