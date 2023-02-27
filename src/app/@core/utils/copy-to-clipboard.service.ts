import { Injectable } from '@angular/core';
import { ToastService } from '@components/toast/toast.service';

@Injectable()
export class CopyToClipboardService {
  constructor(private toastService: ToastService) {}
  copyText(textToCopy, toastMessage?: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = textToCopy;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);

    this.toastService.show(toastMessage ? toastMessage : 'Text copied to clipboard', { classname: 'bg-success text-light', delay: 3000 });
  }
}
