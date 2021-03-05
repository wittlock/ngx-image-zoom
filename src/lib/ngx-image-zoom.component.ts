import { isPlatformServer } from '@angular/common';
import {
    Component,
    ElementRef,
    EventEmitter, Inject,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output, PLATFORM_ID,
    PlatformRef,
    Renderer2,
    ViewChild
} from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';

export interface Coord {
    x: number;
    y: number;
}

@Component({
    selector: 'lib-ngx-image-zoom',
    templateUrl: './ngx-image-zoom.component.html',
    styleUrls: ['./ngx-image-zoom.component.css']
})
export class NgxImageZoomComponent implements OnInit, OnChanges, OnDestroy {

    private static readonly validZoomModes: string[] = ['hover', 'toggle', 'click', 'hover-freeze'];

    @ViewChild('zoomContainer', {static: true}) zoomContainer !: ElementRef;
    @ViewChild('imageThumbnail', {static: true}) imageThumbnail !: ElementRef;
    @ViewChild('fullSizeImage', {static: true}) fullSizeImage !: ElementRef;

    @Output() zoomScroll = new EventEmitter<number>();
    @Output() zoomPosition = new EventEmitter<Coord>();

    public display: string;
    public fullImageTop: number;
    public fullImageLeft: number;
    public magnifiedWidth: number;
    public magnifiedHeight: number;
    public lensTop: number;
    public lensLeft: number;
    public enableLens = false;
    public lensBorderRadius = 0;

    public thumbnailAlt = '';
    public fullsizeAlt = '';
    public thumbImage: string;
    public fullImage: string;
    public thumbWidth: number;
    public thumbHeight: number;
    public fullWidth: number;
    public fullHeight: number;
    public lensWidth = 100;
    public lensHeight = 100;

    private zoomMode = 'hover';
    private magnification = 1;
    private enableScrollZoom = false;
    private scrollStepSize = 0.1;
    private circularLens = false;

    private baseRatio: number;
    private minZoomRatio;
    private maxZoomRatio = 2;
    private xRatio: number;
    private yRatio: number;
    private offsetLeft: number;
    private offsetTop: number;
    private zoomingEnabled = false;
    private zoomFrozen = false;
    private isReady = false;
    private thumbImageLoaded = false;
    private fullImageLoaded = false;

    private latestMouseLeft: number;
    private latestMouseTop: number;

    private eventListeners: (() => void)[] = [];

    constructor(private renderer: Renderer2, private changeDetectorRef: ChangeDetectorRef,
                @Inject(PLATFORM_ID) private platformRef: PlatformRef) {
    }

    @Input('thumbnailAlt')
    public set setThumbnailAlt(thumbnailAlt: string) {
        this.thumbnailAlt = thumbnailAlt;
    }

    @Input('fullsizeAlt')
    public set setFullsizeAlt(fullsizeAlt: string) {
        this.fullsizeAlt = fullsizeAlt;
    }

    @Input('thumbImage')
    public set setThumbImage(thumbImage: string) {
        this.thumbImageLoaded = false;
        this.isReady = false;
        this.thumbImage = thumbImage;
    }

    @Input('fullImage')
    public set setFullImage(fullImage: string) {
        this.fullImageLoaded = false;
        this.isReady = false;
        this.fullImage = fullImage;
    }

    @Input('zoomMode')
    public set setZoomMode(zoomMode: string) {
        if (NgxImageZoomComponent.validZoomModes.some(m => m === zoomMode)) {
            this.zoomMode = zoomMode;
        }
    }

    @Input('magnification')
    public set setMagnification(magnification: number) {
        this.magnification = Number(magnification) || this.magnification;
        this.zoomScroll.emit(this.magnification);
    }

    @Input('minZoomRatio')
    public set setMinZoomRatio(minZoomRatio: number) {
        const ratio = Number(minZoomRatio) || this.minZoomRatio || this.baseRatio || 0;
        this.minZoomRatio = Math.max(ratio, this.baseRatio || 0);
    }

    @Input('maxZoomRatio')
    public set setMaxZoomRatio(maxZoomRatio: number) {
        this.maxZoomRatio = Number(maxZoomRatio) || this.maxZoomRatio;
    }

    @Input('scrollStepSize')
    public set setScrollStepSize(stepSize: number) {
        this.scrollStepSize = Number(stepSize) || this.scrollStepSize;
    }

    @Input('enableLens')
    public set setEnableLens(enable: boolean) {
        this.enableLens = Boolean(enable);
    }

    @Input('lensWidth')
    public set setLensWidth(width: number) {
        this.lensWidth = Number(width) || this.lensWidth;
    }

    @Input('lensHeight')
    public set setLensHeight(height: number) {
        this.lensHeight = Number(height) || this.lensHeight;
    }

    @Input('circularLens')
    public set setCircularLens(enable: boolean) {
        this.circularLens = Boolean(enable);
    }

    @Input('enableScrollZoom')
    public set setEnableScrollZoom(enable: boolean) {
        this.enableScrollZoom = Boolean(enable);
    }

    ngOnInit(): void {
        this.setUpEventListeners();
    }

    ngOnChanges() {
        if (this.enableLens) {
            if (this.circularLens) {
                this.lensBorderRadius = this.lensWidth / 2;
            } else {
                this.lensBorderRadius = 0;
            }
        }

        this.calculateRatioAndOffset();
        this.calculateImageAndLensPosition();
    }

    ngOnDestroy(): void {
        this.eventListeners.forEach((destroyFn) => destroyFn());
    }

    /**
     * Template helper methods
     */
    onThumbImageLoaded() {
        this.thumbImageLoaded = true;
        this.checkImagesLoaded();
    }

    onFullImageLoaded() {
        this.fullImageLoaded = true;
        this.checkImagesLoaded();
    }

    private setUpEventListeners() {
        if (isPlatformServer(this.platformRef)) { return; }

        if (this.zoomMode === 'hover') {
            this.eventListeners.push(
                this.renderer.listen(this.zoomContainer.nativeElement, 'mouseenter', (event) => this.hoverMouseEnter(event))
            );
            this.eventListeners.push(
                this.renderer.listen(this.zoomContainer.nativeElement, 'mouseleave', () => this.hoverMouseLeave())
            );
            this.eventListeners.push(
                this.renderer.listen(this.zoomContainer.nativeElement, 'mousemove', (event) => this.hoverMouseMove(event))
            );
        } else if (this.zoomMode === 'toggle') {
            this.eventListeners.push(
                this.renderer.listen(this.zoomContainer.nativeElement, 'click', (event) => this.toggleClick(event))
            );
        } else if (this.zoomMode === 'click') {
            this.eventListeners.push(
                this.renderer.listen(this.zoomContainer.nativeElement, 'click', (event) => this.clickStarter(event))
            );
            this.eventListeners.push(
                this.renderer.listen(this.zoomContainer.nativeElement, 'mouseleave', () => this.clickMouseLeave())
            );
            this.eventListeners.push(
                this.renderer.listen(this.zoomContainer.nativeElement, 'mousemove', (event) => this.clickMouseMove(event))
            );
        } else if (this.zoomMode === 'hover-freeze') {
            this.eventListeners.push(
                this.renderer.listen(this.zoomContainer.nativeElement, 'mouseenter', (event) => this.hoverFreezeMouseEnter(event))
            );
            this.eventListeners.push(
                this.renderer.listen(this.zoomContainer.nativeElement, 'mouseleave', () => this.hoverFreezeMouseLeave())
            );
            this.eventListeners.push(
                this.renderer.listen(this.zoomContainer.nativeElement, 'mousemove', (event) => this.hoverFreezeMouseMove(event))
            );
            this.eventListeners.push(
                this.renderer.listen(this.zoomContainer.nativeElement, 'click', (event) => this.hoverFreezeClick(event))
            );
        }
        if (this.enableScrollZoom) {
            // Chrome: 'mousewheel', Firefox: 'DOMMouseScroll', IE: 'onmousewheel'
            this.eventListeners.push(
                this.renderer.listen(this.zoomContainer.nativeElement, 'mousewheel', (event) => this.onMouseWheel(event))
            );
            this.eventListeners.push(
                this.renderer.listen(this.zoomContainer.nativeElement, 'DOMMouseScroll', (event) => this.onMouseWheel(event))
            );
            this.eventListeners.push(
                this.renderer.listen(this.zoomContainer.nativeElement, 'onmousewheel', (event) => this.onMouseWheel(event))
            );
        }
        if (this.enableLens && this.circularLens) {
            this.lensBorderRadius = this.lensWidth / 2;
        }
    }

    private checkImagesLoaded() {
        if (isPlatformServer(this.platformRef)) { return; }

        this.calculateRatioAndOffset();
        if (this.thumbImageLoaded && this.fullImageLoaded) {
            this.calculateImageAndLensPosition();
            this.isReady = true;
        }
    }

    /**
     * Zoom position setters
     */
    private setZoomPosition(left: number, top: number) {
        this.latestMouseLeft = Number(left) || this.latestMouseLeft;
        this.latestMouseTop = Number(top) || this.latestMouseTop;

        const c: Coord = {
            x: this.latestMouseLeft,
            y: this.latestMouseTop
        };
        this.zoomPosition.emit(c);
    }


    /**
     * Mouse wheel event
     */
    private onMouseWheel(event: any) {
        // Don't eat events if zooming isn't active
        if (!this.zoomingEnabled || this.zoomFrozen) {
            return;
        }

        event = window.event || event; // old IE
        const direction = Math.max(Math.min((event.wheelDelta || -event.detail), 1), -1);
        if (direction > 0) {
            // up
            this.setMagnification = Math.min(this.magnification + this.scrollStepSize, this.maxZoomRatio);
        } else {
            // down
            this.setMagnification = Math.max(this.magnification - this.scrollStepSize, this.minZoomRatio);
        }
        this.calculateRatio();
        this.calculateZoomPosition(event);

        // Prevent scrolling on page.
        event.returnValue = false; // IE
        if (event.preventDefault) {
            event.preventDefault(); // Chrome & FF
        }
    }

    /**
     * Hover mode
     */
    private hoverMouseEnter(event: MouseEvent) {
        this.zoomOn(event);
    }

    private hoverMouseLeave() {
        this.zoomOff();
    }

    private hoverMouseMove(event: MouseEvent) {
        this.calculateZoomPosition(event);
    }

    /**
     * Toggle mode
     */
    private toggleClick(event: MouseEvent) {
        if (this.zoomingEnabled) {
            this.zoomOff();
        } else {
            this.zoomOn(event);
        }
    }

    /**
     * Click mode
     */
    private clickStarter(event: MouseEvent) {
        if (this.zoomingEnabled === false) {
            this.zoomOn(event);
        }
    }

    private clickMouseLeave() {
        this.zoomOff();
    }

    private clickMouseMove(event: MouseEvent) {
        if (this.zoomingEnabled) {
            this.calculateZoomPosition(event);
        }
    }

    /**
     * Hover freeze mode
     */
    private hoverFreezeMouseEnter(event: MouseEvent) {
        if (this.zoomingEnabled && !this.zoomFrozen) {
            this.zoomOn(event);
        }
    }

    private hoverFreezeMouseLeave() {
        if (this.zoomingEnabled && !this.zoomFrozen) {
            this.zoomOff();
        }
    }

    private hoverFreezeMouseMove(event: MouseEvent) {
        if (this.zoomingEnabled && !this.zoomFrozen) {
            this.calculateZoomPosition(event);
        }
    }

    private hoverFreezeClick(event: MouseEvent) {
        if (this.zoomingEnabled && this.zoomFrozen) {
            this.zoomFrozen = false;
            this.zoomOff();
        } else if (this.zoomingEnabled) {
            this.zoomFrozen = true;
        } else {
            this.zoomOn(event);
        }
    }

    /**
     * Private helper methods
     */
    private zoomOn(event: MouseEvent) {
        if (this.isReady) {
            this.zoomingEnabled = true;
            this.calculateRatioAndOffset();
            this.display = 'block';
            this.calculateZoomPosition(event);
        }
    }

    private zoomOff() {
        this.zoomingEnabled = false;
        this.display = 'none';
        this.changeDetectorRef.markForCheck();
    }

    private calculateZoomPosition(event: MouseEvent) {
        const newLeft = Math.max(Math.min(event.offsetX, this.thumbWidth), 0);
        const newTop = Math.max(Math.min(event.offsetY, this.thumbHeight), 0);

        this.setZoomPosition(newLeft, newTop);

        this.calculateImageAndLensPosition();
    }

    private calculateImageAndLensPosition() {
        let lensLeftMod = 0;
        let lensTopMod = 0;

        if (this.enableLens) {
            lensLeftMod = this.lensLeft = this.latestMouseLeft - this.lensWidth / 2;
            lensTopMod = this.lensTop = this.latestMouseTop - this.lensHeight / 2;
        }

        this.fullImageLeft = (this.latestMouseLeft * -this.xRatio) - lensLeftMod;
        this.fullImageTop = (this.latestMouseTop * -this.yRatio) - lensTopMod;

        this.changeDetectorRef.markForCheck();
    }

    private calculateRatioAndOffset() {
        if (isPlatformServer(this.platformRef)) { return; }

        this.thumbWidth = this.imageThumbnail.nativeElement.width;
        this.thumbHeight = this.imageThumbnail.nativeElement.height;

        // If lens is disabled, set lens size to equal thumb size and position it on top of the thumb
        if (!this.enableLens) {
            this.lensWidth = this.thumbWidth;
            this.lensHeight = this.thumbHeight;
            this.lensLeft = 0;
            this.lensTop = 0;
        }

        // getBoundingClientRect() ? https://stackoverflow.com/a/44008873
        this.offsetTop = this.imageThumbnail.nativeElement.getBoundingClientRect().top;
        this.offsetLeft = this.imageThumbnail.nativeElement.getBoundingClientRect().left;

        if (this.fullImage === undefined) {
            this.fullImage = this.thumbImage;
        }

        if (this.fullImageLoaded) {
            this.fullWidth = this.fullSizeImage.nativeElement.naturalWidth;
            this.fullHeight = this.fullSizeImage.nativeElement.naturalHeight;

            this.baseRatio = Math.max(
                (this.thumbWidth / this.fullWidth),
                (this.thumbHeight / this.fullHeight));

            // Don't allow zooming to smaller than thumbnail size
            this.minZoomRatio = Math.max(this.minZoomRatio || 0, this.baseRatio || 0);

            this.calculateRatio();
        }
    }

    private calculateRatio() {
        this.magnifiedWidth = (this.fullWidth * this.magnification);
        this.magnifiedHeight = (this.fullHeight * this.magnification);

        this.xRatio = (this.magnifiedWidth - this.thumbWidth) / this.thumbWidth;
        this.yRatio = (this.magnifiedHeight - this.thumbHeight) / this.thumbHeight;
    }
}
