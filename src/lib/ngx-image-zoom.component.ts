import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { NgxImageZoomService } from './ngx-image-zoom.service';
import { ZoomMode } from './zoom-modes/zoom-mode';
import { Subscription } from 'rxjs';

export interface Coord {
    x: number;
    y: number;
}

@Component({
    selector: 'lib-ngx-image-zoom',
    templateUrl: './ngx-image-zoom.component.html',
    styleUrls: ['./ngx-image-zoom.component.css'],
    providers: [NgxImageZoomService]
})
export class NgxImageZoomComponent implements OnInit, OnChanges, OnDestroy {

    private static readonly validZoomModes: string[] = ['hover', 'toggle', 'click', 'toggle-click', 'toggle-freeze', 'hover-freeze'];

    @ViewChild('zoomContainer', {static: true}) zoomContainer !: ElementRef;
    @ViewChild('imageThumbnail', {static: true}) imageThumbnail !: ElementRef;
    @ViewChild('fullSizeImage', {static: true}) fullSizeImage !: ElementRef;

    @Output() zoomScroll = new EventEmitter<number>();
    @Output() zoomPosition = new EventEmitter<Coord>();
    @Output() imagesLoaded = new EventEmitter<boolean>();

    public thumbImage?: string | SafeUrl | null;
    public fullImage?: string | SafeUrl | null;
    public thumbWidth = 0;
    public thumbHeight = 0;
    public lensBorderRadius = 0;

    private zoomMode = 'hover';
    private magnification = 1;
    private enableScrollZoom = false;
    private scrollStepSize = 0.1;
    private circularLens = false;

    private lensWidth = 100;
    private lensHeight = 100;
    private baseRatio?: number;
    private minZoomRatio = 1;
    private maxZoomRatio = 2;
    private thumbImageLoaded = false;
    private fullImageLoaded = false;


    private zoomInstance: ZoomMode | undefined;
    private subscriptions: Array<Subscription> = [];
    private eventListeners: (() => void)[] = [];

    constructor(public zoomService: NgxImageZoomService, private renderer: Renderer2) {
    }

    @Input('thumbImage')
    public set setThumbImage(thumbImage: string | SafeUrl | null) {
        this.thumbImageLoaded = false;
        this.setIsReady(false);
        this.thumbImage = thumbImage;
    }

    @Input('fullImage')
    public set setFullImage(fullImage: string | SafeUrl | null) {
        this.fullImageLoaded = false;
        this.setIsReady(false);
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
        this.zoomService.magnification = Number(magnification) || this.zoomService.magnification;
        this.zoomScroll.emit(this.zoomService.magnification);
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
        this.zoomService.enableLens = Boolean(enable);
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

    @Input() altText = '';
    @Input() titleText = '';

    ngOnInit(): void {
        // Pass along image references to the service.
        this.zoomService.imageThumbnail = this.imageThumbnail;
        this.zoomService.fullSizeImage = this.fullSizeImage;

        this.registerServiceSubscriptions();

        // Load zoom mode and set up configuration.
        this.loadZoomMode();
        this.registerEventListeners();
        this.calculateLensBorder();
    }

    ngOnChanges() {
        this.calculateLensBorder();
        this.zoomService.calculateRatioAndOffset();
        this.zoomService.calculateImageAndLensPosition();
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((subscription) => subscription.unsubscribe());
        this.eventListeners.forEach((destroyFn) => destroyFn());
    }

    private registerServiceSubscriptions() {
        this.subscriptions.push(
            this.zoomService.zoomPosition.subscribe((position) => this.zoomPosition.emit(position)),
        );
    }

    private loadZoomMode(): void {
        import(`./zoom-modes/${this.zoomMode}-zoom-mode`).then((zoomMode) => {
            this.zoomInstance = new zoomMode.default(
                this.zoomService
            ) as ZoomMode;
        }).catch((error) => {
            console.error(`Failed to load zoom mode '${this.zoomMode}':`, error);
        });
    }

    private registerEventListeners(): void {
        if (this.zoomInstance) {
            const nativeElement = this.zoomContainer.nativeElement;
            this.eventListeners.push(
                this.renderer.listen(nativeElement, 'mouseenter', (event) => this.zoomInstance.onMouseEnter(event)),
                this.renderer.listen(nativeElement, 'mouseleave', (event) => this.zoomInstance.onMouseLeave(event)),
                this.renderer.listen(nativeElement, 'mousemove', (event) => this.zoomInstance.onMouseLeave(event)),
                this.renderer.listen(nativeElement, 'click', (event) => this.zoomInstance.onMouseLeave(event)),
                this.renderer.listen(nativeElement, 'mousewheel', (event) => {
                    if (this.zoomInstance.onMouseWheel(event)) {
                        this.onMouseWheel(event);
                    }
                }),
                this.renderer.listen(nativeElement, 'DOMMouseScroll', (event) => {
                    if (this.zoomInstance.onMouseWheel(event)) {
                        this.onMouseWheel(event);
                    }
                }),
                this.renderer.listen(nativeElement, 'onmousewheel', (event) => {
                    if (this.zoomInstance.onMouseWheel(event)) {
                        this.onMouseWheel(event);
                    }
                })
            );
        }
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

    private calculateLensBorder() {
        if (this.zoomService.enableLens) {
            if (this.circularLens) {
                this.lensBorderRadius = this.lensWidth / 2;
            } else {
                this.lensBorderRadius = 0;
            }
        }
    }

    private checkImagesLoaded() {
        this.zoomService.calculateRatioAndOffset();
        if (this.thumbImageLoaded && this.fullImageLoaded) {
            this.zoomService.calculateImageAndLensPosition();
            this.setIsReady(true);
        }
    }

    private setIsReady(value: boolean) {
        this.zoomService.isReady = value;
        this.imagesLoaded.emit(value);
    }

    /**
     * Mouse wheel event
     */
    private onMouseWheel(event: any) {
        // Don't eat events if scrollZoom or zooming isn't active
        if (!this.enableScrollZoom || !this.zoomService.zoomingEnabled) {
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
        this.zoomService.calculateRatio();
        this.zoomService.calculateZoomPosition(event);

        // Prevent scrolling on page.
        event.returnValue = false; // IE
        if (event.preventDefault) {
            event.preventDefault(); // Chrome & FF
        }
    }
}
