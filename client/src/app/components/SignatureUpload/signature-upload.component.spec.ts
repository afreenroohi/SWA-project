import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignatureUploadComponent } from './signature-upload.component';

describe('SignatureUploadComponent', () => {
  let component: SignatureUploadComponent;
  let fixture: ComponentFixture<SignatureUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignatureUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignatureUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
