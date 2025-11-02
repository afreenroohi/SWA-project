import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BidsToBeApprovedComponent } from './bids-to-be-approved.component';

describe('BidsToBeApprovedComponent', () => {
  let component: BidsToBeApprovedComponent;
  let fixture: ComponentFixture<BidsToBeApprovedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BidsToBeApprovedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BidsToBeApprovedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
