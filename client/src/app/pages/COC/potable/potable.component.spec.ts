import { ComponentFixture, TestBed } from '@angular/core/testing';

import { POTableComponent } from './potable.component';

describe('POTableComponent', () => {
  let component: POTableComponent;
  let fixture: ComponentFixture<POTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ POTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(POTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
