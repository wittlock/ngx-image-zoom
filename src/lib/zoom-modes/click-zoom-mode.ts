import { ZoomMode } from './zoom-mode';
import { NgxImageZoomService } from '../ngx-image-zoom.service';

export class ClickZoomMode implements ZoomMode {
    constructor(private zoomService: NgxImageZoomService) {}

    onClick(event: MouseEvent): void {
        if (this.zoomService.zoomingEnabled === false) {
            this.zoomService.zoomOn(event);
        }
    }

    onMouseEnter(): void {
        // NOP
    }

    onMouseLeave(): void {
        this.zoomService.zoomOff();
    }

    onMouseMove(event: MouseEvent): void {
        if (this.zoomService.zoomingEnabled) {
            this.zoomService.calculateZoomPosition(event);
        }
    }

    onMouseWheel(): boolean {
        return true;
    }
}
