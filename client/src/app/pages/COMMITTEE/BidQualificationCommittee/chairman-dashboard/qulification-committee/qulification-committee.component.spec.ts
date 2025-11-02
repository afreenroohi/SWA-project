import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QulificationCommitteeComponent } from './qulification-committee.component';

describe('QulificationCommitteeComponent', () => {
  let component: QulificationCommitteeComponent;
  let fixture: ComponentFixture<QulificationCommitteeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QulificationCommitteeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QulificationCommitteeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
