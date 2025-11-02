import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopFiveCardComponent } from './top-five-card.component';

describe('TopFiveCardComponent', () => {
  let component: TopFiveCardComponent;
  let fixture: ComponentFixture<TopFiveCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopFiveCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopFiveCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
