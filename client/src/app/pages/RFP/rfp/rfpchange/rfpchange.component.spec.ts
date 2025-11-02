import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RfpchangeComponent } from './rfpchange.component';

describe('RfpchangeComponent', () => {
  let component: RfpchangeComponent;
  let fixture: ComponentFixture<RfpchangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RfpchangeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RfpchangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
