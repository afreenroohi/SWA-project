import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SESListComponent } from './seslist.component';

describe('SESListComponent', () => {
  let component: SESListComponent;
  let fixture: ComponentFixture<SESListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SESListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SESListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
