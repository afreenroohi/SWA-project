import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreteCOCComponent } from './crete-coc.component';

describe('CreteCOCComponent', () => {
  let component: CreteCOCComponent;
  let fixture: ComponentFixture<CreteCOCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreteCOCComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreteCOCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
