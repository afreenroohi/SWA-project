import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FromEvalCommitteeComponent } from './from-eval-committee.component';

describe('FromEvalCommitteeComponent', () => {
  let component: FromEvalCommitteeComponent;
  let fixture: ComponentFixture<FromEvalCommitteeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FromEvalCommitteeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FromEvalCommitteeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
