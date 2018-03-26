import { Component, ElementRef, Input, OnChanges, OnInit, Renderer2, ViewChild } from '@angular/core';

@Component({
    selector: 'ngx-image-zoom',
    templateUrl: './ngx-image-zoom.component.html',
    styleUrls: ['./ngx-image-zoom.component.css']
})
export class NgxImageZoomComponent implements OnInit, OnChanges {
    @Input('thumbImage') thumbImage: String;
    @Input('fullImage') fullImage: String;
    @Input('magnification') magnification = 1;
    @Input('zoomMode') zoomMode: 'hover' | 'toggle' | 'click' | 'hover-freeze' = 'hover';
    @Input('enableScrollZoom') enableScrollZoom = false;
    @Input('enableLens') enableLens = false;
    @Input('lensWidth') lensWidth = 100;
    @Input('lensHeight') lensHeight = 100;
    @Input('circularLens') circularLens = false;

    @ViewChild('zoomContainer') zoomContainer: ElementRef;
    @ViewChild('imageThumbnail') imageThumbnail: ElementRef;
    @ViewChild('fullSizeImage') fullSizeImage: ElementRef;

    public display: string;
    public fullImageTop: number;
    public fullImageLeft: number;
    public magnifiedWidth: number;
    public magnifiedHeight: number;
    public lensTop: number;
    public lensLeft: number;
    public lensBorderRadius = 0;

    public thumbWidth: number;
    public thumbHeight: number;
    public fullWidth: number;
    public fullHeight: number;

    private baseRatio: number;
    private xRatio: number;
    private yRatio: number;
    private offsetLeft: number;
    private offsetTop: number;
    private zoomingEnabled = false;
    private zoomFrozen = false;

    private latestMouseLeft: number;
    private latestMouseTop: number;

    constructor(private renderer: Renderer2) {
    }

    ngOnInit() {
        if (this.zoomMode === 'hover') {
            this.renderer.listen(this.zoomContainer.nativeElement, 'mouseenter', (event) => this.hoverMouseEnter(event));
            this.renderer.listen(this.zoomContainer.nativeElement, 'mouseleave', () => this.hoverMouseLeave());
            this.renderer.listen(this.zoomContainer.nativeElement, 'mousemove', (event) => this.hoverMouseMove(event));
        } else if (this.zoomMode === 'toggle') {
            this.renderer.listen(this.zoomContainer.nativeElement, 'click', (event) => this.toggleClick(event));
        } else if (this.zoomMode === 'click') {
            this.renderer.listen(this.zoomContainer.nativeElement, 'click', (event) => this.clickStarter(event));
            this.renderer.listen(this.zoomContainer.nativeElement, 'mouseleave', () => this.clickMouseLeave());
            this.renderer.listen(this.zoomContainer.nativeElement, 'mousemove', (event) => this.clickMouseMove(event));
        } else if (this.zoomMode === 'hover-freeze') {
            this.renderer.listen(this.zoomContainer.nativeElement, 'mouseenter', (event) => this.hoverFreezeMouseEnter(event));
            this.renderer.listen(this.zoomContainer.nativeElement, 'mouseleave', () => this.hoverFreezeMouseLeave());
            this.renderer.listen(this.zoomContainer.nativeElement, 'mousemove', (event) => this.hoverFreezeMouseMove(event));
            this.renderer.listen(this.zoomContainer.nativeElement, 'click', (event) => this.hoverFreezeClick(event));
        }
        if (this.enableScrollZoom) {
            // Chrome: 'mousewheel', Firefox: 'DOMMouseScroll', IE: 'onmousewheel'
            this.renderer.listen(this.zoomContainer.nativeElement, 'mousewheel', (event) => this.onMouseWheel(event));
            this.renderer.listen(this.zoomContainer.nativeElement, 'DOMMouseScroll', (event) => this.onMouseWheel(event));
            this.renderer.listen(this.zoomContainer.nativeElement, 'onmousewheel', (event) => this.onMouseWheel(event));
        }
        if (this.enableLens && this.circularLens) {
            this.lensBorderRadius = this.lensWidth / 2;
        }
    }

    ngOnChanges() {
        if (this.enableLens) {
            if (this.circularLens) {
                this.lensBorderRadius = this.lensWidth / 2;
            } else {
                this.lensBorderRadius = 0;
            }
        }
        this.calculateImageAndLensPosition();
    }

    /**
     * Template helper methods
     */
    thumbImageLoaded() {
        this.calculateRatioAndOffset();
    }

    fullImageLoaded() {
        this.calculateRatioAndOffset();
        this.calculateImageAndLensPosition();
    }

    /**
     * Mouse wheel event
     */
    private onMouseWheel(event: any) {
        event = window.event || event; // old IE
        const direction = Math.max(Math.min((event.wheelDelta || -event.detail), 1), -1);
        if (direction > 0) {
            // up
            this.magnification = Math.min(this.magnification + 0.1, 10);
        } else {
            // down
            this.magnification = Math.max(this.magnification - 0.1, this.baseRatio);
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
        this.zoomingEnabled = !this.zoomingEnabled;
    }

    /**
     * Click mode
     */
    private clickStarter(event: MouseEvent) {
        if (this.zoomingEnabled === false) {
            this.zoomingEnabled = true;
            this.zoomOn(event);
        }
    }

    private clickMouseLeave() {
        this.zoomOff();
        this.zoomingEnabled = false;
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
            this.zoomingEnabled = false;
            this.zoomFrozen = false;
            this.zoomOff();
        } else if (this.zoomingEnabled) {
            this.zoomFrozen = true;
        } else {
            this.zoomingEnabled = true;
            this.zoomOn(event);
        }
    }

    /**
     * Private helper methods
     */
    private zoomOn(event: MouseEvent) {
        this.calculateRatioAndOffset();
        this.display = 'block';
        this.calculateZoomPosition(event);
    }

    private zoomOff() {
        this.display = 'none';
    }

    private calculateZoomPosition(event: MouseEvent) {
        const left = (event.pageX - this.offsetLeft);
        const top = (event.pageY - this.offsetTop);

        this.latestMouseLeft = Math.max(Math.min(left, this.thumbWidth), 0);
        this.latestMouseTop = Math.max(Math.min(top, this.thumbHeight), 0);

        this.calculateImageAndLensPosition();
    }

    private calculateImageAndLensPosition() {
        let lensLeftMod = 0, lensTopMod = 0;

        if (this.enableLens) {
            lensLeftMod = this.lensLeft = this.latestMouseLeft - this.lensWidth / 2;
            lensTopMod = this.lensTop = this.latestMouseTop - this.lensHeight / 2;
        }

        this.fullImageLeft = (this.latestMouseLeft * -this.xRatio) - lensLeftMod;
        this.fullImageTop = (this.latestMouseTop * -this.yRatio) - lensTopMod;
    }

    private calculateRatioAndOffset() {
        this.thumbWidth = this.imageThumbnail.nativeElement.naturalWidth;
        this.thumbHeight = this.imageThumbnail.nativeElement.naturalHeight;

        // If lens is disabled, set lens size to equal thumb size and position it on top of the thumb
        if (!this.enableLens) {
            this.lensWidth = this.thumbWidth;
            this.lensHeight = this.thumbHeight;
            this.lensLeft = 0;
            this.lensTop = 0;
        }

        // getBoundingClientRect() ? https://stackoverflow.com/a/44008873
        this.offsetTop = this.zoomContainer.nativeElement.offsetTop;
        this.offsetLeft = this.zoomContainer.nativeElement.offsetLeft;
        // If we have an offsetParent, we need to add its offset too and recurse until we can't find more offsetParents.
        let parentContainer = this.zoomContainer.nativeElement.offsetParent;
        while (parentContainer != null) {
            this.offsetTop += parentContainer.offsetTop;
            this.offsetLeft += parentContainer.offsetLeft;
            parentContainer = parentContainer.offsetParent;
        }

        if (this.fullImage === undefined) {
            this.fullImage = this.thumbImage;
        }
        this.fullWidth = this.fullSizeImage.nativeElement.naturalWidth;
        this.fullHeight = this.fullSizeImage.nativeElement.naturalHeight;

        this.baseRatio = Math.max(
            (this.thumbWidth / this.fullWidth),
            (this.thumbHeight / this.fullHeight));

        this.calculateRatio();
    }

    private calculateRatio() {
        this.magnifiedWidth = (this.fullWidth * this.magnification);
        this.magnifiedHeight = (this.fullHeight * this.magnification);

        this.xRatio = (this.magnifiedWidth - this.thumbWidth) / this.thumbWidth;
        this.yRatio = (this.magnifiedHeight - this.thumbHeight) / this.thumbHeight;
    }
}
