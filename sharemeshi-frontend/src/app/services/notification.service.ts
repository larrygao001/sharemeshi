import { Injectable } from '@angular/core';

declare var PNotify: any;

@Injectable()
export class NotificationService {
    constructor() {
    }
    showNotification(title, content, type) {
        const notify = new PNotify({
            title: title,
            text: content,
            type: type,
            buttons: {
                sticker: false
            }
        });
    }

}
