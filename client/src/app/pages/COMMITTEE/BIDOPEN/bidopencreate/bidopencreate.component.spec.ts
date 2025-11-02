import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BidopencreateComponent } from './bidopencreate.component';

describe('BidopencreateComponent', () => {
  let component: BidopencreateComponent;
  let fixture: ComponentFixture<BidopencreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BidopencreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BidopencreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
