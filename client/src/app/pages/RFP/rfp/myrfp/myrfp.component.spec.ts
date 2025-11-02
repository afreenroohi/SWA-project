import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyrfpComponent } from './myrfp.component';

describe('MyrfpComponent', () => {
  let component: MyrfpComponent;
  let fixture: ComponentFixture<MyrfpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyrfpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyrfpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
