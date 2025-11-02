import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RfplistComponent } from './rfplist.component';

describe('RfplistComponent', () => {
  let component: RfplistComponent;
  let fixture: ComponentFixture<RfplistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RfplistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RfplistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
