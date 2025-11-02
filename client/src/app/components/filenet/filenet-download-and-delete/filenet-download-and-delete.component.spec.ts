import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilenetDownloadAndDeleteComponent } from './filenet-download-and-delete.component';

describe('FilenetDownloadAndDeleteComponent', () => {
  let component: FilenetDownloadAndDeleteComponent;
  let fixture: ComponentFixture<FilenetDownloadAndDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilenetDownloadAndDeleteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilenetDownloadAndDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
