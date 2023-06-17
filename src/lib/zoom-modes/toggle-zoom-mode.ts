import { ZoomMode } from './zoom-mode';
import { NgxImageZoomService } from '../ngx-image-zoom.service';

export class ToggleZoomMode implements ZoomMode {
    constructor(private zoomService: NgxImageZoomService) {}

    onClick(event: MouseEvent): void {
        if (this.zoomService.zoomingEnabled) {
            this.zoomService.zoomOff();
        } else {
            this.zoomService.zoomOn(event);
        }
    }

    onMouseEnter(): void {
        // NOP
    }
    onMouseLeave(): void {
        // NOP
    }
    onMouseMove(): void {
        // NOP
    }
    onMouseWheel(): boolean {
        return true;
    }
}
