import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Toast } from '../../services/toast.service';
import { ToastService } from '../../services/toast.service';
import { ToastComponent } from './toast.component';
import { of } from 'rxjs';

describe('ToastComponent', () => {
  let component: ToastComponent;
  let fixture: ComponentFixture<ToastComponent>;

  beforeEach(() => {
    const toastServiceStub: Partial<ToastService> = {
      toasts$: of([]), // Use 'of' to create an observable with a value
      remove: (toast: Toast) => ({})
    };
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ToastComponent],
      providers: [{ provide: ToastService, useValue: toastServiceStub }]
    });
    fixture = TestBed.createComponent(ToastComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`toasts has default value`, () => {
    expect(component.toasts).toEqual([]);
  });

  describe('removeToast', () => {
    it('makes expected calls', () => {
      const toastStub: Toast = {} as Toast;
      const toastServiceStub: ToastService = fixture.debugElement.injector.get(
        ToastService
      );
      spyOn(toastServiceStub, 'remove').and.callThrough();
      component.removeToast(toastStub);
      expect(toastServiceStub.remove).toHaveBeenCalled();
    });
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      spyOn(component, 'removeToast').and.callThrough();
      component.ngOnInit();
      expect(component.removeToast).toHaveBeenCalled();
    });
  });
});
