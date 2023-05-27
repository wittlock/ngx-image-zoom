import { ZoomMode } from './zoom-mode';
import { NgxImageZoomService } from '../ngx-image-zoom.service';

export class HoverZoomMode implements ZoomMode {
    constructor(private zoomService: NgxImageZoomService) {}

    onClick(event: MouseEvent): void {}

    onMouseEnter(event: MouseEvent): void {
        this.zoomService.zoomOn(event);
    }

    onMouseLeave(event: MouseEvent): void {
        this.zoomService.zoomOff();
    }

    onMouseMove(event: MouseEvent): void {
        this.zoomService.calculateZoomPosition(event);
    }

    onMouseWheel(event: MouseEvent): boolean {
        return true;
    }
}
