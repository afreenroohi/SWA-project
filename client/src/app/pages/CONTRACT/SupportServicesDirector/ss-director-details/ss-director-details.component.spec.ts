import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SsDirectorDetailsComponent } from './ss-director-details.component';

describe('SsDirectorDetailsComponent', () => {
  let component: SsDirectorDetailsComponent;
  let fixture: ComponentFixture<SsDirectorDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SsDirectorDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SsDirectorDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
