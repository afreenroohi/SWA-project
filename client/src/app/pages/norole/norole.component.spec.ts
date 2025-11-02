import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoroleComponent } from './norole.component';

describe('NoroleComponent', () => {
  let component: NoroleComponent;
  let fixture: ComponentFixture<NoroleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoroleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoroleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
