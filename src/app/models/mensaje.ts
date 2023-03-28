import { Toast, ToasterService } from 'angular2-toaster';

import { Info } from './info.interface';
import Swal from 'sweetalert2';
import { inject } from '@angular/core';

export class Mensaje {
  private toasterServ: ToasterService;
  private timeout = 5000;
  constructor() {
    this.toasterServ = inject(ToasterService);
  }

  public showAlert(info: Info) {
    Swal.fire({ title: 'Mensaje', text: info.notification.mensajeUsuario, confirmButtonColor: '#D60D2B' });
  }

  public showMessage(info: Info, sticky?: boolean) {
    let is_sticky = false;
    let timeout = this.timeout;
    let showCloseButton = false;
    if (sticky) {
      is_sticky = true;
      timeout = 0;
      showCloseButton = true;
    }

    if (info.status === 401) {
      if (info.error) {
        const toaster: Toast = {
          type: info.error.notification.severidad,
          title: 'Mensaje',
          body: 'No pudo entrar',
          timeout,
          showCloseButton
        };
        this.toasterServ.pop(toaster);
      } else {
        const toaster: Toast = {
          type: info.notification.severidad,
          title: 'Mensaje',
          body: 'no pudo entrar',
          timeout,
          showCloseButton
        };
        this.toasterServ.pop(toaster);
      }
    } else if (info.status > 0 && info.status < 500) {
      if (info.error) {
        const toaster: Toast = {
          type: info.error.notification.severidad,
          title: 'Mensaje',
          body: info.error.notification.mensajeUsuario,
          timeout,
          showCloseButton
        };
        this.toasterServ.pop(toaster);
      } else {
        if (info.notification.severidad.toString() === 'alert') {
          this.showAlert(info);
        } else {
          const toaster: Toast = {
            type: info.notification.severidad,
            title: 'Mensaje',
            body: info.notification.mensajeUsuario,
            timeout,
            showCloseButton
          };
          this.toasterServ.pop(toaster);
        }
      }
    } else if (info.status === 500 || info.status === 0) {
      if (info.error.notification) {
        const toaster: Toast = {
          type: 'error',
          title: 'Mensaje',
          body: info.error.notification.mensajeUsuario,
          timeout,
          showCloseButton
        };
        this.toasterServ.pop(toaster);
      } else {
        const msg = info.message;
        this.messageError(msg, is_sticky);
      }
    } else {
      const toaster: Toast = {
        type: info.notification.severidad,
        title: 'Mensaje',
        body: info.notification.mensajeUsuario,
        timeout,
        showCloseButton
      };
      this.toasterServ.pop(toaster);
    }
  }

  public messageError(info: string, sticky?: boolean) {
    const timeout = this.timeout;
    const toaster: Toast = {
      type: 'error',
      title: 'Mensaje',
      body: info,
      showCloseButton: sticky,
      timeout: sticky ? 0 : timeout
    };
    this.toasterServ.pop(toaster);
  }

  public messageWarning(info: string, sticky?: boolean) {
    const timeout = this.timeout;
    const toaster: Toast = {
      type: 'warning',
      title: 'Información',
      body: info,
      showCloseButton: sticky,
      timeout: sticky ? 0 : timeout
    };
    this.toasterServ.pop(toaster);
  }

  public messageSuccess(info: string, sticky?: boolean) {
    const timeout = this.timeout;
    const toaster: Toast = {
      type: 'success',
      title: 'Mensaje',
      body: info,
      showCloseButton: sticky,
      timeout: sticky ? 0 : timeout
    };
    this.toasterServ.pop(toaster);
  }

  public messageInfo(info: string, sticky?: boolean) {
    const timeout = this.timeout;
    const toaster: Toast = {
      type: 'info',
      title: 'Mensaje',
      body: info,
      showCloseButton: sticky,
      timeout: sticky ? 0 : timeout
    };
    this.toasterServ.pop(toaster);
  }

  public messageWait(info: string, sticky?: boolean) {
    const timeout = this.timeout;
    const toaster: Toast = {
      type: 'wait',
      title: 'Mensaje',
      body: info,
      showCloseButton: sticky,
      timeout: sticky ? 0 : timeout
    };
    this.toasterServ.pop(toaster);
  }
}
