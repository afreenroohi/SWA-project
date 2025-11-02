import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilenetUploadComponent } from './filenet-upload.component';

describe('FilenetUploadComponent', () => {
  let component: FilenetUploadComponent;
  let fixture: ComponentFixture<FilenetUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilenetUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilenetUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
