import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DpEvaluationCommitteeComponent } from './dp-evaluation-committee.component';

describe('DpEvaluationCommitteeComponent', () => {
  let component: DpEvaluationCommitteeComponent;
  let fixture: ComponentFixture<DpEvaluationCommitteeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DpEvaluationCommitteeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DpEvaluationCommitteeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
