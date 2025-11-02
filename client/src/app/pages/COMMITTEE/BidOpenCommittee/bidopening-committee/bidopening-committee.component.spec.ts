import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BidopeningCommitteeComponent } from './bidopening-committee.component';

describe('BidopeningCommitteeComponent', () => {
  let component: BidopeningCommitteeComponent;
  let fixture: ComponentFixture<BidopeningCommitteeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BidopeningCommitteeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BidopeningCommitteeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
