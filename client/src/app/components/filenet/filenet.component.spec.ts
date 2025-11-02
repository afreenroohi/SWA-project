import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilenetComponent } from './filenet.component';

describe('FilenetComponent', () => {
  let component: FilenetComponent;
  let fixture: ComponentFixture<FilenetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilenetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilenetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
