import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignLegalOfficerComponent } from './assign-legal-officer.component';

describe('AssignLegalOfficerComponent', () => {
  let component: AssignLegalOfficerComponent;
  let fixture: ComponentFixture<AssignLegalOfficerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignLegalOfficerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignLegalOfficerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
