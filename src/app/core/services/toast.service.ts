import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  options = {
    progressBar: true,
    showDuration: 300,
    hideDuration: 1000,
    preventDuplicates: true,
    showMethod: 'fadeIn',
    hideMethod: 'fadeOut',

  }

  constructor(private toastr: ToastrService) { }
  noty(type: string, message: string) {
    switch (type) {
      case 'error':
        this.toastr.error(message, `Error!`, this.options);
        break;
      case 'success':
        this.toastr.success(message, `Completado!`, this.options);
        break;
      case 'info':
        this.toastr.info(message, `Importante!`, this.options)
        break;
      case 'warning':
        this.toastr.warning(message, `Advertencia!`, this.options)
        break;

      default:
        this.toastr.info(message, `Notificación!`, this.options)
        break;
    }
  }

  error(title: string, message: string) {
    this.toastr.error(message, title, this.options);
  }

  warning(title: string, message: string) {
    this.toastr.warning(message, title, this.options);
  }

  info(title: string, message: string) {
    this.toastr.info(message, title, this.options);
  }

  success(title: string, message: string) {
    this.toastr.success(message, title, this.options);
  }
}
