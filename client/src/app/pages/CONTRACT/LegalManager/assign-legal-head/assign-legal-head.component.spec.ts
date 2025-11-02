import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignLegalHeadComponent } from './assign-legal-head.component';

describe('AssignLegalHeadComponent', () => {
  let component: AssignLegalHeadComponent;
  let fixture: ComponentFixture<AssignLegalHeadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignLegalHeadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignLegalHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
