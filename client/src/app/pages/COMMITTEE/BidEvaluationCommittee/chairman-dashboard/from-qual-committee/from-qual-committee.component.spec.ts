import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FromQualCommitteeComponent } from './from-qual-committee.component';

describe('FromQualCommitteeComponent', () => {
  let component: FromQualCommitteeComponent;
  let fixture: ComponentFixture<FromQualCommitteeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FromQualCommitteeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FromQualCommitteeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
