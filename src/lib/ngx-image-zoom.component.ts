import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { NgxImageZoomService } from './ngx-image-zoom.service';
import { ClickZoomMode } from './zoom-modes/click-mode';
import { HoverFreezeZoomMode } from './zoom-modes/hover-freeze-mode';
import { HoverZoomMode } from './zoom-modes/hover-zoom-mode';
import { ToggleClickZoomMode } from './zoom-modes/toggle-click-mode';
import { ToggleFreezeZoomMode } from './zoom-modes/toggle-freeze-mode';
import { ToggleZoomMode } from './zoom-modes/toggle-zoom-mode';
import { ZoomMode } from './zoom-modes/zoom-mode';

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
    public lensBorderRadius = 0;

    private zoomMode = 'hover';
    // private magnification = 1;
    private enableScrollZoom = false;
    private scrollStepSize = 0.1;
    private circularLens = false;

    // private lensWidth = 100;
    // private lensHeight = 100;
    // private baseRatio?: number;
    // private minZoomRatio = 1;
    // private maxZoomRatio = 2;
    private thumbImageLoaded = false;
    // private fullImageLoaded = false;

    private zoomInstance: ZoomMode | undefined;
    private subscriptions: Array<Subscription> = [];
    private eventListeners: (() => void)[] = [];

    private zoomModesMap = new Map<string, new (zoomService: NgxImageZoomService) => ZoomMode>([
        ['click', ClickZoomMode],
        ['hover-freeze', HoverFreezeZoomMode],
        ['hover', HoverZoomMode],
        ['toggle-click', ToggleClickZoomMode],
        ['toggle-freeze', ToggleFreezeZoomMode],
        ['toggle', ToggleZoomMode],
    ]);

    constructor(public zoomService: NgxImageZoomService, private renderer: Renderer2) {}

    @Input('thumbImage')
    public set setThumbImage(thumbImage: string | SafeUrl | null) {
        this.thumbImageLoaded = false;
        this.setIsReady(false);
        this.thumbImage = thumbImage;
    }

    @Input('fullImage')
    public set setFullImage(fullImage: string | SafeUrl | null) {
        this.zoomService.fullImageLoaded = false;
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
        const ratio = Number(minZoomRatio) || this.zoomService.minZoomRatio || this.zoomService.baseRatio || 0;
        this.zoomService.minZoomRatio = Math.max(ratio, this.zoomService.baseRatio || 0);
    }

    @Input('maxZoomRatio')
    public set setMaxZoomRatio(maxZoomRatio: number) {
        this.zoomService.maxZoomRatio = Number(maxZoomRatio) || this.zoomService.maxZoomRatio;
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
        this.zoomService.lensWidth = Number(width) || this.zoomService.lensWidth;
    }

    @Input('lensHeight')
    public set setLensHeight(height: number) {
        this.zoomService.lensHeight = Number(height) || this.zoomService.lensHeight;
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
        if (this.fullSizeImage === undefined) {
            this.fullSizeImage = this.imageThumbnail;
        }

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
        const ZoomModeClass = this.zoomModesMap.get(this.zoomMode);
        if (ZoomModeClass) {
            this.zoomInstance = new ZoomModeClass(this.zoomService);
        } else {
            console.error(`Unsupported zoom mode: ${this.zoomMode}`);
        }
    }

    private registerEventListeners(): void {
        if (this.zoomInstance) {
            const nativeElement = this.zoomContainer.nativeElement;

            this.eventListeners.push(
                this.renderer.listen(nativeElement, 'mouseenter', (event) => this.zoomInstance.onMouseEnter(event)),
                this.renderer.listen(nativeElement, 'mouseleave', (event) => this.zoomInstance.onMouseLeave(event)),
                this.renderer.listen(nativeElement, 'mousemove', (event) => this.zoomInstance.onMouseMove(event)),
                this.renderer.listen(nativeElement, 'click', (event) => this.zoomInstance.onClick(event)),

                // Chrome: 'mousewheel', Firefox: 'DOMMouseScroll', IE: 'onmousewheel'
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
        // Pass along image sizes to the service.
        this.zoomService.thumbWidth = this.imageThumbnail.nativeElement.width;
        this.zoomService.thumbHeight = this.imageThumbnail.nativeElement.height;
        this.thumbImageLoaded = true;
        this.checkImagesLoaded();
    }

    onFullImageLoaded() {
        // Pass along image sizes to the service.
        this.zoomService.fullWidth = this.fullSizeImage.nativeElement.naturalWidth;
        this.zoomService.fullHeight = this.fullSizeImage.nativeElement.naturalHeight;
        this.zoomService.fullImageLoaded = true;
        this.checkImagesLoaded();
    }

    private calculateLensBorder() {
        if (this.zoomService.enableLens) {
            if (this.circularLens) {
                this.lensBorderRadius = this.zoomService.lensWidth / 2;
            } else {
                this.lensBorderRadius = 0;
            }
        }
    }

    private checkImagesLoaded() {
        this.zoomService.calculateRatioAndOffset();
        if (this.thumbImageLoaded && this.zoomService.fullImageLoaded) {
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
            this.setMagnification = Math.min(this.zoomService.magnification + this.scrollStepSize, this.zoomService.maxZoomRatio);
        } else {
            // down
            this.setMagnification = Math.max(this.zoomService.magnification - this.scrollStepSize, this.zoomService.minZoomRatio);
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
