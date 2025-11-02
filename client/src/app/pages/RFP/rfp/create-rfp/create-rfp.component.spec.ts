import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRFPComponent } from './create-rfp.component';

describe('CreateRFPComponent', () => {
  let component: CreateRFPComponent;
  let fixture: ComponentFixture<CreateRFPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateRFPComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRFPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
