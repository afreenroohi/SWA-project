import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitteeTableComponent } from './committee-table.component';

describe('CommitteeTableComponent', () => {
  let component: CommitteeTableComponent;
  let fixture: ComponentFixture<CommitteeTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommitteeTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitteeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
