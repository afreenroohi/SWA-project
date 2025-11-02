import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfOpenContractComponent } from './list-of-open-contract.component';

describe('ListOfOpenContractComponent', () => {
  let component: ListOfOpenContractComponent;
  let fixture: ComponentFixture<ListOfOpenContractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListOfOpenContractComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOfOpenContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
