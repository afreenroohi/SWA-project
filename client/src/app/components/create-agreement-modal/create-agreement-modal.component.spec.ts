import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateAgreementModalComponent } from './create-agreement-modal.component';

describe('CreateAgreementModalComponent', () => {
  let component: CreateAgreementModalComponent;
  let fixture: ComponentFixture<CreateAgreementModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateAgreementModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAgreementModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit isVisibleChange when handleCancel is called', () => {
    spyOn(component.isVisibleChange, 'emit');
    component.handleCancel();
    expect(component.isVisibleChange.emit).toHaveBeenCalledWith(false);
  });

  it('should emit optionSelected when selectOption is called', () => {
    spyOn(component.optionSelected, 'emit');
    component.selectOption('scratch');
    expect(component.optionSelected.emit).toHaveBeenCalledWith('scratch');
  });
});
