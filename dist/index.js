import { Component, EventEmitter, Input, NgModule, Output, Renderer2, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @record
 */

var NgxImageZoomComponent = (function () {
    function NgxImageZoomComponent(renderer) {
        this.renderer = renderer;
        this.onZoomScroll = new EventEmitter();
        this.onZoomPosition = new EventEmitter();
        this.enableLens = false;
        this.lensBorderRadius = 0;
        this.lensWidth = 100;
        this.lensHeight = 100;
        this.zoomMode = 'hover';
        this.magnification = 1;
        this.enableScrollZoom = false;
        this.scrollStepSize = 0.1;
        this.circularLens = false;
        this.maxZoomRatio = 2;
        this.zoomingEnabled = false;
        this.zoomFrozen = false;
        this.isReady = false;
        this.thumbImageLoaded = false;
        this.fullImageLoaded = false;
    }
    Object.defineProperty(NgxImageZoomComponent.prototype, "setThumbImage", {
        set: /**
         * @param {?} thumbImage
         * @return {?}
         */
        function (thumbImage) {
            this.thumbImageLoaded = false;
            this.isReady = false;
            this.thumbImage = thumbImage;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgxImageZoomComponent.prototype, "setFullImage", {
        set: /**
         * @param {?} fullImage
         * @return {?}
         */
        function (fullImage) {
            this.fullImageLoaded = false;
            this.isReady = false;
            this.fullImage = fullImage;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgxImageZoomComponent.prototype, "setZoomMode", {
        set: /**
         * @param {?} zoomMode
         * @return {?}
         */
        function (zoomMode) {
            if (NgxImageZoomComponent.validZoomModes.some(function (m) { return m === zoomMode; })) {
                this.zoomMode = zoomMode;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgxImageZoomComponent.prototype, "setMagnification", {
        set: /**
         * @param {?} magnification
         * @return {?}
         */
        function (magnification) {
            this.magnification = Number(magnification) || this.magnification;
            this.onZoomScroll.emit(this.magnification);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgxImageZoomComponent.prototype, "setMinZoomRatio", {
        set: /**
         * @param {?} minZoomRatio
         * @return {?}
         */
        function (minZoomRatio) {
            var /** @type {?} */ ratio = Number(minZoomRatio) || this.minZoomRatio || this.baseRatio || 0;
            this.minZoomRatio = Math.max(ratio, this.baseRatio || 0);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgxImageZoomComponent.prototype, "setMaxZoomRatio", {
        set: /**
         * @param {?} maxZoomRatio
         * @return {?}
         */
        function (maxZoomRatio) {
            this.maxZoomRatio = Number(maxZoomRatio) || this.maxZoomRatio;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgxImageZoomComponent.prototype, "setScrollStepSize", {
        set: /**
         * @param {?} stepSize
         * @return {?}
         */
        function (stepSize) {
            this.scrollStepSize = Number(stepSize) || this.scrollStepSize;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgxImageZoomComponent.prototype, "setEnableLens", {
        set: /**
         * @param {?} enable
         * @return {?}
         */
        function (enable) {
            this.enableLens = Boolean(enable);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgxImageZoomComponent.prototype, "setLensWidth", {
        set: /**
         * @param {?} width
         * @return {?}
         */
        function (width) {
            this.lensWidth = Number(width) || this.lensWidth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgxImageZoomComponent.prototype, "setLensHeight", {
        set: /**
         * @param {?} height
         * @return {?}
         */
        function (height) {
            this.lensHeight = Number(height) || this.lensHeight;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgxImageZoomComponent.prototype, "setCircularLens", {
        set: /**
         * @param {?} enable
         * @return {?}
         */
        function (enable) {
            this.circularLens = Boolean(enable);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgxImageZoomComponent.prototype, "setEnableScrollZoom", {
        set: /**
         * @param {?} enable
         * @return {?}
         */
        function (enable) {
            this.enableScrollZoom = Boolean(enable);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgxImageZoomComponent.prototype, "setScrollParentSelector", {
        set: /**
         * @param {?} selector
         * @return {?}
         */
        function (selector) {
            this.scrollParentSelector = selector;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgxImageZoomComponent.prototype, "setImageAlt", {
        set: /**
         * @param {?} imageAlt
         * @return {?}
         */
        function (imageAlt) {
            this.imageAlt = imageAlt;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    NgxImageZoomComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        if (this.zoomMode === 'hover') {
            this.renderer.listen(this.zoomContainer.nativeElement, 'mouseenter', function (event) { return _this.hoverMouseEnter(event); });
            this.renderer.listen(this.zoomContainer.nativeElement, 'mouseleave', function () { return _this.hoverMouseLeave(); });
            this.renderer.listen(this.zoomContainer.nativeElement, 'mousemove', function (event) { return _this.hoverMouseMove(event); });
        }
        else if (this.zoomMode === 'toggle') {
            this.renderer.listen(this.zoomContainer.nativeElement, 'click', function (event) { return _this.toggleClick(event); });
        }
        else if (this.zoomMode === 'click') {
            this.renderer.listen(this.zoomContainer.nativeElement, 'click', function (event) { return _this.clickStarter(event); });
            this.renderer.listen(this.zoomContainer.nativeElement, 'mouseleave', function () { return _this.clickMouseLeave(); });
            this.renderer.listen(this.zoomContainer.nativeElement, 'mousemove', function (event) { return _this.clickMouseMove(event); });
        }
        else if (this.zoomMode === 'hover-freeze') {
            this.renderer.listen(this.zoomContainer.nativeElement, 'mouseenter', function (event) { return _this.hoverFreezeMouseEnter(event); });
            this.renderer.listen(this.zoomContainer.nativeElement, 'mouseleave', function () { return _this.hoverFreezeMouseLeave(); });
            this.renderer.listen(this.zoomContainer.nativeElement, 'mousemove', function (event) { return _this.hoverFreezeMouseMove(event); });
            this.renderer.listen(this.zoomContainer.nativeElement, 'click', function (event) { return _this.hoverFreezeClick(event); });
        }
        if (this.enableScrollZoom) {
            // Chrome: 'mousewheel', Firefox: 'DOMMouseScroll', IE: 'onmousewheel'
            this.renderer.listen(this.zoomContainer.nativeElement, 'mousewheel', function (event) { return _this.onMouseWheel(event); });
            this.renderer.listen(this.zoomContainer.nativeElement, 'DOMMouseScroll', function (event) { return _this.onMouseWheel(event); });
            this.renderer.listen(this.zoomContainer.nativeElement, 'onmousewheel', function (event) { return _this.onMouseWheel(event); });
        }
        if (this.enableLens && this.circularLens) {
            this.lensBorderRadius = this.lensWidth / 2;
        }
    };
    /**
     * @return {?}
     */
    NgxImageZoomComponent.prototype.ngOnChanges = /**
     * @return {?}
     */
    function () {
        if (this.enableLens) {
            if (this.circularLens) {
                this.lensBorderRadius = this.lensWidth / 2;
            }
            else {
                this.lensBorderRadius = 0;
            }
        }
        this.calculateRatioAndOffset();
        this.calculateImageAndLensPosition();
    };
    /**
     * @return {?}
     */
    NgxImageZoomComponent.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
        this.scrollParent = document.querySelector(this.scrollParentSelector);
    };
    /**
     * Template helper methods
     */
    /**
     * Template helper methods
     * @return {?}
     */
    NgxImageZoomComponent.prototype.onThumbImageLoaded = /**
     * Template helper methods
     * @return {?}
     */
    function () {
        this.thumbImageLoaded = true;
        this.checkImagesLoaded();
    };
    /**
     * @return {?}
     */
    NgxImageZoomComponent.prototype.onFullImageLoaded = /**
     * @return {?}
     */
    function () {
        this.fullImageLoaded = true;
        this.checkImagesLoaded();
    };
    /**
     * @return {?}
     */
    NgxImageZoomComponent.prototype.checkImagesLoaded = /**
     * @return {?}
     */
    function () {
        this.calculateRatioAndOffset();
        if (this.thumbImageLoaded && this.fullImageLoaded) {
            this.calculateImageAndLensPosition();
            this.isReady = true;
        }
    };
    /**
     * Zoom position setters
     * @param {?} left
     * @param {?} top
     * @return {?}
     */
    NgxImageZoomComponent.prototype.setZoomPosition = /**
     * Zoom position setters
     * @param {?} left
     * @param {?} top
     * @return {?}
     */
    function (left, top) {
        this.latestMouseLeft = Number(left) || this.latestMouseLeft;
        this.latestMouseTop = Number(top) || this.latestMouseTop;
        var /** @type {?} */ c = {
            x: this.latestMouseLeft,
            y: this.latestMouseTop
        };
        this.onZoomPosition.emit(c);
    };
    /**
     * Mouse wheel event
     * @param {?} event
     * @return {?}
     */
    NgxImageZoomComponent.prototype.onMouseWheel = /**
     * Mouse wheel event
     * @param {?} event
     * @return {?}
     */
    function (event) {
        event = window.event || event; // old IE
        var /** @type {?} */ direction = Math.max(Math.min((event.wheelDelta || -event.detail), 1), -1);
        if (direction > 0) {
            // up
            this.setMagnification = Math.min(this.magnification + this.scrollStepSize, this.maxZoomRatio);
        }
        else {
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
    };
    /**
     * Hover mode
     * @param {?} event
     * @return {?}
     */
    NgxImageZoomComponent.prototype.hoverMouseEnter = /**
     * Hover mode
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this.zoomOn(event);
    };
    /**
     * @return {?}
     */
    NgxImageZoomComponent.prototype.hoverMouseLeave = /**
     * @return {?}
     */
    function () {
        this.zoomOff();
    };
    /**
     * @param {?} event
     * @return {?}
     */
    NgxImageZoomComponent.prototype.hoverMouseMove = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this.calculateZoomPosition(event);
    };
    /**
     * Toggle mode
     * @param {?} event
     * @return {?}
     */
    NgxImageZoomComponent.prototype.toggleClick = /**
     * Toggle mode
     * @param {?} event
     * @return {?}
     */
    function (event) {
        if (this.zoomingEnabled) {
            this.zoomOff();
        }
        else {
            this.zoomOn(event);
        }
        this.zoomingEnabled = !this.zoomingEnabled;
    };
    /**
     * Click mode
     * @param {?} event
     * @return {?}
     */
    NgxImageZoomComponent.prototype.clickStarter = /**
     * Click mode
     * @param {?} event
     * @return {?}
     */
    function (event) {
        if (this.zoomingEnabled === false) {
            this.zoomingEnabled = true;
            this.zoomOn(event);
        }
    };
    /**
     * @return {?}
     */
    NgxImageZoomComponent.prototype.clickMouseLeave = /**
     * @return {?}
     */
    function () {
        this.zoomOff();
        this.zoomingEnabled = false;
    };
    /**
     * @param {?} event
     * @return {?}
     */
    NgxImageZoomComponent.prototype.clickMouseMove = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        if (this.zoomingEnabled) {
            this.calculateZoomPosition(event);
        }
    };
    /**
     * Hover freeze mode
     * @param {?} event
     * @return {?}
     */
    NgxImageZoomComponent.prototype.hoverFreezeMouseEnter = /**
     * Hover freeze mode
     * @param {?} event
     * @return {?}
     */
    function (event) {
        if (this.zoomingEnabled && !this.zoomFrozen) {
            this.zoomOn(event);
        }
    };
    /**
     * @return {?}
     */
    NgxImageZoomComponent.prototype.hoverFreezeMouseLeave = /**
     * @return {?}
     */
    function () {
        if (this.zoomingEnabled && !this.zoomFrozen) {
            this.zoomOff();
        }
    };
    /**
     * @param {?} event
     * @return {?}
     */
    NgxImageZoomComponent.prototype.hoverFreezeMouseMove = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        if (this.zoomingEnabled && !this.zoomFrozen) {
            this.calculateZoomPosition(event);
        }
    };
    /**
     * @param {?} event
     * @return {?}
     */
    NgxImageZoomComponent.prototype.hoverFreezeClick = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        if (this.zoomingEnabled && this.zoomFrozen) {
            this.zoomingEnabled = false;
            this.zoomFrozen = false;
            this.zoomOff();
        }
        else if (this.zoomingEnabled) {
            this.zoomFrozen = true;
        }
        else {
            this.zoomingEnabled = true;
            this.zoomOn(event);
        }
    };
    /**
     * Private helper methods
     * @param {?} event
     * @return {?}
     */
    NgxImageZoomComponent.prototype.zoomOn = /**
     * Private helper methods
     * @param {?} event
     * @return {?}
     */
    function (event) {
        if (this.isReady) {
            this.calculateRatioAndOffset();
            this.display = 'block';
            this.calculateZoomPosition(event);
        }
    };
    /**
     * @return {?}
     */
    NgxImageZoomComponent.prototype.zoomOff = /**
     * @return {?}
     */
    function () {
        this.display = 'none';
    };
    /**
     * @param {?} event
     * @return {?}
     */
    NgxImageZoomComponent.prototype.calculateZoomPosition = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        var /** @type {?} */ scrollLeftOffset = 0;
        var /** @type {?} */ scrollTopOffset = 0;
        if (this.scrollParent !== null) {
            scrollLeftOffset = this.scrollParent.scrollLeft;
            scrollTopOffset = this.scrollParent.scrollTop;
        }
        var /** @type {?} */ left = (event.pageX - this.offsetLeft + scrollLeftOffset);
        var /** @type {?} */ top = (event.pageY - this.offsetTop + scrollTopOffset);
        var /** @type {?} */ newLeft = Math.max(Math.min(left, this.thumbWidth), 0);
        var /** @type {?} */ newTop = Math.max(Math.min(top, this.thumbHeight), 0);
        this.setZoomPosition(newLeft, newTop);
        this.calculateImageAndLensPosition();
    };
    /**
     * @return {?}
     */
    NgxImageZoomComponent.prototype.calculateImageAndLensPosition = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ lensLeftMod = 0, /** @type {?} */ lensTopMod = 0;
        if (this.enableLens) {
            lensLeftMod = this.lensLeft = this.latestMouseLeft - this.lensWidth / 2;
            lensTopMod = this.lensTop = this.latestMouseTop - this.lensHeight / 2;
        }
        this.fullImageLeft = (this.latestMouseLeft * -this.xRatio) - lensLeftMod;
        this.fullImageTop = (this.latestMouseTop * -this.yRatio) - lensTopMod;
    };
    /**
     * @return {?}
     */
    NgxImageZoomComponent.prototype.calculateRatioAndOffset = /**
     * @return {?}
     */
    function () {
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
        var /** @type {?} */ parentContainer = this.zoomContainer.nativeElement.offsetParent;
        while (parentContainer != null) {
            this.offsetTop += parentContainer.offsetTop;
            this.offsetLeft += parentContainer.offsetLeft;
            parentContainer = parentContainer.offsetParent;
        }
        if (this.fullImage === undefined) {
            this.fullImage = this.thumbImage;
        }
        if (this.fullImageLoaded) {
            this.fullWidth = this.fullSizeImage.nativeElement.naturalWidth;
            this.fullHeight = this.fullSizeImage.nativeElement.naturalHeight;
            this.baseRatio = Math.max((this.thumbWidth / this.fullWidth), (this.thumbHeight / this.fullHeight));
            // Don't allow zooming to smaller than thumbnail size
            this.minZoomRatio = Math.max(this.minZoomRatio || 0, this.baseRatio || 0);
            this.calculateRatio();
        }
    };
    /**
     * @return {?}
     */
    NgxImageZoomComponent.prototype.calculateRatio = /**
     * @return {?}
     */
    function () {
        this.magnifiedWidth = (this.fullWidth * this.magnification);
        this.magnifiedHeight = (this.fullHeight * this.magnification);
        this.xRatio = (this.magnifiedWidth - this.thumbWidth) / this.thumbWidth;
        this.yRatio = (this.magnifiedHeight - this.thumbHeight) / this.thumbHeight;
    };
    NgxImageZoomComponent.validZoomModes = ['hover', 'toggle', 'click', 'hover-freeze'];
    NgxImageZoomComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ngx-image-zoom',
                    template: "<div #zoomContainer class=\"ngxImageZoomContainer\" [style.width.px]=\"this.thumbWidth\" [style.height.px]=\"this.thumbHeight\"> <img #imageThumbnail class=\"ngxImageZoomThumbnail\" src=\"{{ thumbImage }}\" width=\"100%\" height=\"100%\" (load)=\"onThumbImageLoaded()\" [alt]=\"imageAlt\"/> <div [ngClass]=\"{'ngxImageZoomFullContainer': true, 'ngxImageZoomLensEnabled': this.enableLens}\" [style.display]=\"this.display\" [style.top.px]=\"this.lensTop\" [style.left.px]=\"this.lensLeft\" [style.width.px]=\"this.lensWidth\" [style.height.px]=\"this.lensHeight\" [style.border-radius.px]=\"this.lensBorderRadius\" > <img #fullSizeImage class=\"ngxImageZoomFull\" src=\"{{ fullImage }}\" (load)=\"onFullImageLoaded()\" [style.display]=\"this.display\" [style.top.px]=\"this.fullImageTop\" [style.left.px]=\"this.fullImageLeft\" [style.width.px]=\"this.magnifiedWidth\" [style.height.px]=\"this.magnifiedHeight\" [alt]=\"imageAlt\" /> </div> </div> ",
                    styles: [".ngxImageZoomContainer { position: relative; margin: auto; overflow: hidden; } .ngxImageZoomFull { position: absolute; max-width: none; max-height: none; display: none; } .ngxImageZoomFullContainer { position: absolute; overflow: hidden; } .ngxImageZoomFullContainer.ngxImageZoomLensEnabled { border: 2px solid red; cursor: crosshair; } "]
                },] },
    ];
    /** @nocollapse */
    NgxImageZoomComponent.ctorParameters = function () { return [
        { type: Renderer2, },
    ]; };
    NgxImageZoomComponent.propDecorators = {
        "zoomContainer": [{ type: ViewChild, args: ['zoomContainer',] },],
        "imageThumbnail": [{ type: ViewChild, args: ['imageThumbnail',] },],
        "fullSizeImage": [{ type: ViewChild, args: ['fullSizeImage',] },],
        "onZoomScroll": [{ type: Output },],
        "onZoomPosition": [{ type: Output },],
        "setThumbImage": [{ type: Input, args: ['thumbImage',] },],
        "setFullImage": [{ type: Input, args: ['fullImage',] },],
        "setZoomMode": [{ type: Input, args: ['zoomMode',] },],
        "setMagnification": [{ type: Input, args: ['magnification',] },],
        "setMinZoomRatio": [{ type: Input, args: ['minZoomRatio',] },],
        "setMaxZoomRatio": [{ type: Input, args: ['maxZoomRatio',] },],
        "setScrollStepSize": [{ type: Input, args: ['scrollStepSize',] },],
        "setEnableLens": [{ type: Input, args: ['enableLens',] },],
        "setLensWidth": [{ type: Input, args: ['lensWidth',] },],
        "setLensHeight": [{ type: Input, args: ['lensHeight',] },],
        "setCircularLens": [{ type: Input, args: ['circularLens',] },],
        "setEnableScrollZoom": [{ type: Input, args: ['enableScrollZoom',] },],
        "setScrollParentSelector": [{ type: Input, args: ['scrollParentSelector',] },],
        "setImageAlt": [{ type: Input, args: ['imageAlt',] },],
    };
    return NgxImageZoomComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var NgxImageZoomModule = (function () {
    function NgxImageZoomModule() {
    }
    /**
     * @return {?}
     */
    NgxImageZoomModule.forRoot = /**
     * @return {?}
     */
    function () {
        return {
            ngModule: NgxImageZoomModule,
        };
    };
    NgxImageZoomModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        CommonModule
                    ],
                    declarations: [
                        NgxImageZoomComponent
                    ],
                    exports: [
                        NgxImageZoomComponent
                    ]
                },] },
    ];
    return NgxImageZoomModule;
}());

export { NgxImageZoomModule, NgxImageZoomComponent };
