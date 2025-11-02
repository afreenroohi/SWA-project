import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CocWithPoComponent } from './coc-with-po.component';

describe('CocWithPoComponent', () => {
  let component: CocWithPoComponent;
  let fixture: ComponentFixture<CocWithPoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CocWithPoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CocWithPoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
