import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrequalificationViewComponent } from './prequalification-view.component';

describe('PrequalificationViewComponent', () => {
  let component: PrequalificationViewComponent;
  let fixture: ComponentFixture<PrequalificationViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrequalificationViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrequalificationViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
