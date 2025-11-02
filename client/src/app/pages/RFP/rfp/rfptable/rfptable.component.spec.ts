import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RfptableComponent } from './rfptable.component';

describe('RfptableComponent', () => {
  let component: RfptableComponent;
  let fixture: ComponentFixture<RfptableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RfptableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RfptableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
