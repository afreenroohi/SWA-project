import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BidsToBeOpenedComponent } from './bids-to-be-opened.component';

describe('BidsToBeOpenedComponent', () => {
  let component: BidsToBeOpenedComponent;
  let fixture: ComponentFixture<BidsToBeOpenedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BidsToBeOpenedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BidsToBeOpenedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
