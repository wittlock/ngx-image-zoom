import { ZoomMode } from './zoom-mode';
import { NgxImageZoomService } from '../ngx-image-zoom.service';

export class ToggleZoomMode extends ZoomMode {
    constructor(private zoomService: NgxImageZoomService) {
        super();
    }

    onClick(event: MouseEvent): void {
        if (this.zoomService.zoomingEnabled) {
            this.zoomService.zoomOff();
        } else {
            this.zoomService.zoomOn(event);
        }
    }
}
