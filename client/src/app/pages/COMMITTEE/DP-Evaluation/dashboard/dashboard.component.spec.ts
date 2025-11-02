import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DpDashboardComponent } from './dashboard.component';

describe('DpDashboardComponent', () => {
  let component: DpDashboardComponent;
  let fixture: ComponentFixture<DpDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DpDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DpDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
