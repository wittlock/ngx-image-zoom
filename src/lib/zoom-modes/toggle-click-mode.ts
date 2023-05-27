import { ZoomMode } from './zoom-mode';
import { NgxImageZoomService } from '../ngx-image-zoom.service';

export class ToggleClickZoomMode implements ZoomMode {
    constructor(private zoomService: NgxImageZoomService) {}

    onClick(event: MouseEvent): void {
        if (this.zoomService.zoomingEnabled) {
            this.zoomService.zoomOff();
        } else {
            this.zoomService.zoomOn(event);
        }
    }

    onMouseEnter(event: MouseEvent): void {}

    onMouseLeave(event: MouseEvent): void {
        this.zoomService.zoomOff();
    }

    onMouseMove(event: MouseEvent): void {
        if (this.zoomService.zoomingEnabled) {
            this.zoomService.calculateZoomPosition(event);
        }
    }

    onMouseWheel(event: MouseEvent): boolean {
        return true;
    }
}
