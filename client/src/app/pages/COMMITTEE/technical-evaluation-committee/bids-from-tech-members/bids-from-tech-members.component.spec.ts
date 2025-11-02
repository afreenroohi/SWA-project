import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BidsFromTechMembersComponent } from './bids-from-tech-members.component';

describe('BidsFromTechMembersComponent', () => {
  let component: BidsFromTechMembersComponent;
  let fixture: ComponentFixture<BidsFromTechMembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BidsFromTechMembersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BidsFromTechMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
