import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingreviewDashboardComponent } from './pendingreview-dashboard.component';

describe('PendingreviewDashboardComponent', () => {
  let component: PendingreviewDashboardComponent;
  let fixture: ComponentFixture<PendingreviewDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingreviewDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingreviewDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
