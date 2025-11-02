import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectPurchaseListComponent } from './direct-purchase-list.component';

describe('DirectPurchaseListComponent', () => {
  let component: DirectPurchaseListComponent;
  let fixture: ComponentFixture<DirectPurchaseListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DirectPurchaseListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectPurchaseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
