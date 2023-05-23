import { ZoomMode } from './zoom-mode';
import { NgxImageZoomService } from '../ngx-image-zoom.service';

export class HoverFreezeZoomMode extends ZoomMode {
    private zoomFrozen = false;
    constructor(private zoomService: NgxImageZoomService) {
        super();
    }

    onClick(event: MouseEvent): void {
        if (this.zoomService.zoomingEnabled && this.zoomFrozen) {
            this.zoomFrozen = false;
        } else if (this.zoomService.zoomingEnabled) {
            this.zoomFrozen = true;
            this.zoomService.markForCheck();
        } else {
            this.zoomService.zoomOn(event);
        }
    }

    onMouseEnter(event: MouseEvent) {
        if (!this.zoomFrozen) {
            this.zoomService.zoomOn(event);
        }
    }

    onMouseLeave(event: MouseEvent): void {
        if (this.zoomService.zoomingEnabled && !this.zoomFrozen) {
            this.zoomService.zoomOff();
        }
    }

    onMouseMove(event: MouseEvent): void {
        if (this.zoomService.zoomingEnabled && !this.zoomFrozen) {
            this.zoomService.calculateZoomPosition(event);
        }
    }

    onMouseWheel(event: MouseEvent): boolean {
        // Prevent scroll zoom if we're frozen
        return !this.zoomFrozen;
    }
}
