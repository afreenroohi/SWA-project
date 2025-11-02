import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VpCorServDashboardComponent } from './vp-cor-serv-dashboard.component';

describe('VpCorServDashboardComponent', () => {
  let component: VpCorServDashboardComponent;
  let fixture: ComponentFixture<VpCorServDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VpCorServDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VpCorServDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
