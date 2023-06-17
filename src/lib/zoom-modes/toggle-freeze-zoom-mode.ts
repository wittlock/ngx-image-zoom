import { ZoomMode } from './zoom-mode';
import { NgxImageZoomService } from '../ngx-image-zoom.service';

export class ToggleFreezeZoomMode implements ZoomMode {
    private zoomFrozen = false;
    constructor(private zoomService: NgxImageZoomService) {}

    onClick(event: MouseEvent): void {
        if (this.zoomService.zoomingEnabled && this.zoomFrozen) {
            this.zoomFrozen = false;
            this.zoomService.zoomOff();
        } else if (this.zoomService.zoomingEnabled) {
            this.zoomFrozen = true;
            this.zoomService.markForCheck();
        } else {
            this.zoomService.zoomOn(event);
        }
    }

    onMouseEnter(): void {
        // NOP
    }

    onMouseLeave(): void {
        if (this.zoomService.zoomingEnabled && !this.zoomFrozen) {
            this.zoomService.zoomOff();
        }
    }

    onMouseMove(event: MouseEvent): void {
        if (this.zoomService.zoomingEnabled && !this.zoomFrozen) {
            this.zoomService.calculateZoomPosition(event);
        }
    }

    onMouseWheel(): boolean {
        // Prevent scroll zoom if we're frozen
        return !this.zoomFrozen;
    }
}
