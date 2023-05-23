import { ZoomMode } from './zoom-mode';
import { NgxImageZoomService } from '../ngx-image-zoom.service';

export class ToggleClickZoomMode extends ZoomMode {
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

    onMouseLeave(event: MouseEvent): void {
        this.zoomService.zoomOff();
    }

    onMouseMove(event: MouseEvent): void {
        if (this.zoomService.zoomingEnabled) {
            this.zoomService.calculateZoomPosition(event);
        }
    }
}
