import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyprequalComponent } from './myprequal.component';

describe('MyprequalComponent', () => {
  let component: MyprequalComponent;
  let fixture: ComponentFixture<MyprequalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyprequalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyprequalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
