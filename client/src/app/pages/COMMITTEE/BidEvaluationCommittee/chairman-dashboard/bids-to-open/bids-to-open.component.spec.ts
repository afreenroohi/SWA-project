import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BidsToOpenComponent } from './bids-to-open.component';

describe('BidsToOpenComponent', () => {
  let component: BidsToOpenComponent;
  let fixture: ComponentFixture<BidsToOpenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BidsToOpenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BidsToOpenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
