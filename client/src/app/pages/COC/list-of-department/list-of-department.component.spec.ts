import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfDepartmentComponent } from './list-of-department.component';

describe('ListOfDepartmentComponent', () => {
  let component: ListOfDepartmentComponent;
  let fixture: ComponentFixture<ListOfDepartmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListOfDepartmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOfDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
