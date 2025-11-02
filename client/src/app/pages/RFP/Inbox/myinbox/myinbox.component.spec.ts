import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyinboxComponent } from './myinbox.component';

describe('MyinboxComponent', () => {
  let component: MyinboxComponent;
  let fixture: ComponentFixture<MyinboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyinboxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyinboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
