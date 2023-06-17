import { ZoomMode } from './zoom-mode';
import { NgxImageZoomService } from '../ngx-image-zoom.service';

export class HoverZoomMode implements ZoomMode {
    constructor(private zoomService: NgxImageZoomService) {}

    onClick(): void {
        // NOP
    }

    onMouseEnter(event: MouseEvent): void {
        this.zoomService.zoomOn(event);
    }

    onMouseLeave(): void {
        this.zoomService.zoomOff();
    }

    onMouseMove(event: MouseEvent): void {
        this.zoomService.calculateZoomPosition(event);
    }

    onMouseWheel(): boolean {
        return true;
    }
}
