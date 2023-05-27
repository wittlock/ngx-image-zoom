import { ChangeDetectorRef, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Coord } from './ngx-image-zoom.component';

@Injectable()
export class NgxImageZoomService {

    public zoomDisplay = 'none';
    public thumbWidth = 0;
    public thumbHeight = 0;
    public fullImageTop = 0;
    public fullImageLeft = 0;
    public lensWidth = 100;
    public lensHeight = 100;
    public lensTop = 0;
    public lensLeft = 0;
    public magnifiedWidth = 0;
    public magnifiedHeight = 0;
    public zoomPosition = new BehaviorSubject<Coord>(null);

    public zoomingEnabled = false;
    public isReady = false;
    public enableLens = false;
    public minZoomRatio = 1;
    public maxZoomRatio = 2;
    public magnification = 1;

    // public imageThumbnail: ElementRef;
    // public fullSizeImage: ElementRef;
    public fullImageLoaded: boolean;

    public fullWidth = 0;
    public fullHeight = 0;
    private xRatio = 0;
    private yRatio = 0;
    private latestMouseLeft = -1;
    private latestMouseTop = -1;

    constructor(private changeDetectorRef: ChangeDetectorRef) {}

    public zoomOn(event: MouseEvent) {
        if (this.isReady) {
            this.zoomingEnabled = true;
            this.calculateRatioAndOffset();
            this.zoomDisplay = 'block';
            this.calculateZoomPosition(event);
            this.changeDetectorRef.markForCheck();
        }
    }

    public zoomOff() {
        this.zoomingEnabled = false;
        this.zoomDisplay = 'none';
        this.changeDetectorRef.markForCheck();
    }

    public markForCheck() {
        this.changeDetectorRef.markForCheck();
    }

    calculateRatioAndOffset() {
        // this.thumbWidth = this.imageThumbnail.nativeElement.width;
        // this.thumbHeight = this.imageThumbnail.nativeElement.height;

        // If lens is disabled, set lens size to equal thumb size and position it on top of the thumb
        if (!this.enableLens) {
            this.lensWidth = this.thumbWidth;
            this.lensHeight = this.thumbHeight;
            this.lensLeft = 0;
            this.lensTop = 0;
        }

        // FIXME
        /*if (this.fullSizeImage === undefined) {
            this.fullSizeImage = this.imageThumbnail;
        }*/

        if (this.fullImageLoaded) {
            // this.fullWidth = this.fullSizeImage.nativeElement.naturalWidth;
            // this.fullHeight = this.fullSizeImage.nativeElement.naturalHeight;

            const baseRatio = Math.max(
                (this.thumbWidth / this.fullWidth),
                (this.thumbHeight / this.fullHeight));

            // Don't allow zooming to smaller than thumbnail size
            this.minZoomRatio = Math.max(this.minZoomRatio || 0, baseRatio || 0);

            this.calculateRatio();
        }
    }

    calculateRatio() {
        this.magnifiedWidth = this.fullWidth * this.magnification;
        this.magnifiedHeight = this.fullHeight * this.magnification;

        this.xRatio = (this.magnifiedWidth - this.thumbWidth) / this.thumbWidth;
        this.yRatio = (this.magnifiedHeight - this.thumbHeight) / this.thumbHeight;
    }

    calculateZoomPosition(event: MouseEvent) {
        const newLeft = Math.max(Math.min(event.offsetX, this.thumbWidth), 0);
        const newTop = Math.max(Math.min(event.offsetY, this.thumbHeight), 0);

        this.setZoomPosition(newLeft, newTop);

        this.calculateImageAndLensPosition();

        this.changeDetectorRef.markForCheck();
    }

    calculateImageAndLensPosition() {
        let lensLeftMod = 0;
        let lensTopMod = 0;

        if (this.enableLens && this.latestMouseLeft > 0) {
            lensLeftMod = this.latestMouseLeft - this.lensWidth / 2;
            lensTopMod = this.latestMouseTop - this.lensHeight / 2;
            this.lensLeft = lensLeftMod;
            this.lensTop = lensTopMod;
        }

        this.fullImageLeft = (this.latestMouseLeft * -this.xRatio) - lensLeftMod;
        this.fullImageTop = (this.latestMouseTop * -this.yRatio) - lensTopMod;
    }

    private setZoomPosition(left: number, top: number) {
        this.latestMouseLeft = Number(left) || this.latestMouseLeft;
        this.latestMouseTop = Number(top) || this.latestMouseTop;

        const newPosition: Coord = {
            x: this.latestMouseLeft,
            y: this.latestMouseTop
        };
        this.zoomPosition.next(newPosition);
    }
}
