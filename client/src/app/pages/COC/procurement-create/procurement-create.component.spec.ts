import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcurementCreateComponent } from './procurement-create.component';

describe('ProcurementCreateComponent', () => {
  let component: ProcurementCreateComponent;
  let fixture: ComponentFixture<ProcurementCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcurementCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcurementCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
