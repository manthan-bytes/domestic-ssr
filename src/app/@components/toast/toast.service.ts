import { Injectable, TemplateRef } from '@angular/core';
import { DataLayerService } from 'src/app/@core/utils/data-layers.service';
import { ToastMsgOption } from '../../@core/interfaces/common.interface';
@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: unknown[] = [];
  constructor(private dataLayerService: DataLayerService) {}

  show(textOrTpl: string | TemplateRef<string>, options: ToastMsgOption) {
    this.toasts.push({ textOrTpl, ...options });
    const messageType = options.classname.includes('bg-success') ? 'Success' : 'Alert';
    this.dataLayerService.siteMessageEvent({
      messageType,
      messageContent: textOrTpl,
    });
    setTimeout(() => {
      this.clear();
    }, options.delay || 0);
  }

  remove(toast) {
    this.toasts = this.toasts.filter((t) => t !== toast);
  }

  clear() {
    this.toasts = [];
  }
}
