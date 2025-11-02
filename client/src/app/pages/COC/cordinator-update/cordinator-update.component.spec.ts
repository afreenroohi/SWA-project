import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CordinatorUpdateComponent } from './cordinator-update.component';

describe('CordinatorUpdateComponent', () => {
  let component: CordinatorUpdateComponent;
  let fixture: ComponentFixture<CordinatorUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CordinatorUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CordinatorUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
