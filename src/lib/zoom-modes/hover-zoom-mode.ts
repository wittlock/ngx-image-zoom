import { ZoomMode } from './zoom-mode';
import { NgxImageZoomService } from '../ngx-image-zoom.service';

export class HoverZoomMode extends ZoomMode {
    constructor(private zoomService: NgxImageZoomService) {
        super();
    }

    onMouseEnter(event: MouseEvent): void {
        this.zoomService.zoomOn(event);
    }

    onMouseLeave(event: MouseEvent): void {
        this.zoomService.zoomOff();
    }

    onMouseMove(event: MouseEvent): void {
        this.zoomService.calculateZoomPosition(event);
    }
}
