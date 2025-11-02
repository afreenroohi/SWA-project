import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalOfficerDashboardComponent } from './legal-officer-dashboard.component';

describe('LegalOfficerDashboardComponent', () => {
  let component: LegalOfficerDashboardComponent;
  let fixture: ComponentFixture<LegalOfficerDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LegalOfficerDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LegalOfficerDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
