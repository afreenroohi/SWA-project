import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalManagerDashboardComponent } from './legal-manager-dashboard.component';

describe('LegalManagerDashboardComponent', () => {
  let component: LegalManagerDashboardComponent;
  let fixture: ComponentFixture<LegalManagerDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LegalManagerDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LegalManagerDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
