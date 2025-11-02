import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BidqualificationcommitteeComponent } from './bidqualificationcommittee.component';

describe('BidqualificationcommitteeComponent', () => {
  let component: BidqualificationcommitteeComponent;
  let fixture: ComponentFixture<BidqualificationcommitteeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BidqualificationcommitteeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BidqualificationcommitteeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
