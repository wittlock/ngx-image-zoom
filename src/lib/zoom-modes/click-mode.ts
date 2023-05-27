import { ZoomMode } from './zoom-mode';
import { NgxImageZoomService } from '../ngx-image-zoom.service';

export class ClickZoomMode extends ZoomMode {
    constructor(private zoomService: NgxImageZoomService) {
        super();
    }

    onClick(event: MouseEvent): void {
        if (this.zoomService.zoomingEnabled === false) {
            this.zoomService.zoomOn(event);
        }
    }

    onMouseLeave(event: MouseEvent): void {
        this.zoomService.zoomOff();
    }

    onMouseMove(event: MouseEvent): void {
        if (this.zoomService.zoomingEnabled) {
            this.zoomService.calculateZoomPosition(event);
        }
    }
}
