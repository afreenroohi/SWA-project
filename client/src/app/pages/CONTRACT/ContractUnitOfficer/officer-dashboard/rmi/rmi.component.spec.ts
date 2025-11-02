import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RmiComponent } from './rmi.component';

describe('RmiComponent', () => {
  let component: RmiComponent;
  let fixture: ComponentFixture<RmiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RmiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RmiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
