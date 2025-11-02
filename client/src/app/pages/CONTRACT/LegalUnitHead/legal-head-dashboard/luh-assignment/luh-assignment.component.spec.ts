import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LuhAssignmentComponent } from './luh-assignment.component';

describe('LuhAssignmentComponent', () => {
  let component: LuhAssignmentComponent;
  let fixture: ComponentFixture<LuhAssignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LuhAssignmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LuhAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
