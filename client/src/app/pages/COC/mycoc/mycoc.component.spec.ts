import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MycocComponent } from './mycoc.component';

describe('MycocComponent', () => {
  let component: MycocComponent;
  let fixture: ComponentFixture<MycocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MycocComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MycocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
