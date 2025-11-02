import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SsDirectorDashboardComponent } from './ss-director-dashboard.component';

describe('SsDirectorDashboardComponent', () => {
  let component: SsDirectorDashboardComponent;
  let fixture: ComponentFixture<SsDirectorDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SsDirectorDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SsDirectorDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
