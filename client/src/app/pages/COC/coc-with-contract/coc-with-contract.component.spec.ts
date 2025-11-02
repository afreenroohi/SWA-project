import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CocWithContractComponent } from './coc-with-contract.component';

describe('CocWithContractComponent', () => {
  let component: CocWithContractComponent;
  let fixture: ComponentFixture<CocWithContractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CocWithContractComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CocWithContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
