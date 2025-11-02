import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitteeMemberMaintenanceComponent } from './committee-member-maintenance.component';

describe('CommitteeMemberMaintenanceComponent', () => {
  let component: CommitteeMemberMaintenanceComponent;
  let fixture: ComponentFixture<CommitteeMemberMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommitteeMemberMaintenanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitteeMemberMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
