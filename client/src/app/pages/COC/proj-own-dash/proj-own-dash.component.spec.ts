import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjOwnDashComponent } from './proj-own-dash.component';

describe('ProjOwnDashComponent', () => {
  let component: ProjOwnDashComponent;
  let fixture: ComponentFixture<ProjOwnDashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjOwnDashComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjOwnDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
