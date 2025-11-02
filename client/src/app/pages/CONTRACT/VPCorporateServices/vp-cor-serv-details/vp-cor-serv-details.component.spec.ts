import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VpCorServDetailsComponent } from './vp-cor-serv-details.component';

describe('VpCorServDetailsComponent', () => {
  let component: VpCorServDetailsComponent;
  let fixture: ComponentFixture<VpCorServDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VpCorServDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VpCorServDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
