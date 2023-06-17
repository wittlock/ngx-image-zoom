/* tslint:disable:no-string-literal */
import { ChangeDetectorRef } from '@angular/core';
import { Coord } from './ngx-image-zoom.component';
import { NgxImageZoomService } from './ngx-image-zoom.service';
import { BehaviorSubject } from 'rxjs';

describe('NgxImageZoomService', () => {
    let zoomService: NgxImageZoomService;
    let changeDetectorRefMock: ChangeDetectorRef;

    beforeEach(() => {
        changeDetectorRefMock = jasmine.createSpyObj('ChangeDetectorRef', ['markForCheck']);
        zoomService = new NgxImageZoomService(changeDetectorRefMock);
    });

    it('should initialize with default values', () => {
        expect(zoomService.zoomDisplay).toBe('none');
        expect(zoomService.thumbWidth).toBe(0);
        expect(zoomService.thumbHeight).toBe(0);
        expect(zoomService.fullImageTop).toBe(0);
        expect(zoomService.fullImageLeft).toBe(0);
        expect(zoomService.lensWidth).toBe(100);
        expect(zoomService.lensHeight).toBe(100);
        expect(zoomService.lensTop).toBe(0);
        expect(zoomService.lensLeft).toBe(0);
        expect(zoomService.magnifiedWidth).toBe(0);
        expect(zoomService.magnifiedHeight).toBe(0);
        expect(zoomService.zoomPosition).toEqual(new BehaviorSubject<Coord>(null));
        expect(zoomService.zoomingEnabled).toBe(false);
        expect(zoomService.isReady).toBe(false);
        expect(zoomService.enableLens).toBe(false);
        expect(zoomService.baseRatio).toBeUndefined();
        expect(zoomService.minZoomRatio).toBe(1);
        expect(zoomService.maxZoomRatio).toBe(2);
        expect(zoomService.magnification).toBe(1);
        expect(zoomService.fullImageLoaded).toBeFalsy();
        expect(zoomService.fullWidth).toBe(0);
        expect(zoomService.fullHeight).toBe(0);
    });

    it('should enable zooming and calculate ratios and offsets when zoomOn is called', () => {
        zoomService.isReady = true;
        zoomService.thumbWidth = 200;
        zoomService.thumbHeight = 150;
        zoomService.fullImageLoaded = true;
        zoomService.fullWidth = 800;
        zoomService.fullHeight = 600;
        const eventMock = new MouseEvent('click');

        zoomService.zoomOn(eventMock);

        expect(zoomService.zoomingEnabled).toBe(true);
        expect(zoomService.zoomDisplay).toBe('block');
        expect(zoomService.baseRatio).toBe(0.25);
        expect(zoomService.minZoomRatio).toBe(1);
        expect(zoomService.magnifiedWidth).toBe(800);
        expect(zoomService.magnifiedHeight).toBe(600);
        expect(changeDetectorRefMock.markForCheck).toHaveBeenCalled();
    });

    it('should disable zooming when zoomOff is called', () => {
        zoomService.zoomingEnabled = true;

        zoomService.zoomOff();

        expect(zoomService.zoomingEnabled).toBe(false);
        expect(zoomService.zoomDisplay).toBe('none');
        expect(changeDetectorRefMock.markForCheck).toHaveBeenCalled();
    });

    it('should update the zoom position and calculate image and lens positions when calculateZoomPosition is called', () => {
        zoomService.enableLens = true;
        zoomService.thumbWidth = 200;
        zoomService.thumbHeight = 150;
        zoomService.fullWidth = 400;
        zoomService.fullHeight = 300;
        zoomService.magnification = 2;

        const eventMock = jasmine.createSpyObj<MouseEvent>('MouseEvent', ['preventDefault']);
        Object.defineProperty(eventMock, 'offsetX', { value: 100 });
        Object.defineProperty(eventMock, 'offsetY', { value: 75 });

        zoomService.calculateRatio();
        zoomService.calculateZoomPosition(eventMock);

        expect(zoomService.lensLeft).toBe(50);
        expect(zoomService.lensTop).toBe(25);
        expect(zoomService.fullImageLeft).toBe(-350);
        expect(zoomService.fullImageTop).toBe(-250);
        expect(zoomService.zoomPosition.value.x).toBe(100);
        expect(zoomService.zoomPosition.value.y).toBe(75);
        expect(changeDetectorRefMock.markForCheck).toHaveBeenCalled();
    });

    it('should call markForCheck when markForCheck is called', () => {
        zoomService.markForCheck();

        expect(changeDetectorRefMock.markForCheck).toHaveBeenCalled();
    });

    it('should update lens size and position when calculateRatioAndOffset is called with lens disabled', () => {
        zoomService.enableLens = false;
        zoomService.thumbWidth = 200;
        zoomService.thumbHeight = 150;
        zoomService.fullImageLoaded = true;
        zoomService.fullWidth = 800;
        zoomService.fullHeight = 600;

        zoomService.calculateRatioAndOffset();

        expect(zoomService.lensWidth).toBe(200);
        expect(zoomService.lensHeight).toBe(150);
        expect(zoomService.lensLeft).toBe(0);
        expect(zoomService.lensTop).toBe(0);
        expect(zoomService.baseRatio).toBe(0.25);
        expect(zoomService.minZoomRatio).toBe(1);
    });

    it('should update lens size and position when calculateRatioAndOffset is called with lens enabled', () => {
        zoomService.enableLens = true;
        zoomService.thumbWidth = 200;
        zoomService.thumbHeight = 150;
        zoomService.fullImageLoaded = true;
        zoomService.fullWidth = 800;
        zoomService.fullHeight = 600;

        zoomService.calculateRatioAndOffset();

        expect(zoomService.lensWidth).toBe(100);
        expect(zoomService.lensHeight).toBe(100);
        expect(zoomService.lensLeft).toBe(0);
        expect(zoomService.lensTop).toBe(0);
        expect(zoomService.baseRatio).toBe(0.25);
        expect(zoomService.minZoomRatio).toBe(1);
    });

    it('should calculate magnified dimensions and ratios when calculateRatio is called', () => {
        zoomService.fullWidth = 800;
        zoomService.fullHeight = 600;
        zoomService.magnification = 2;

        zoomService.calculateRatio();

        expect(zoomService.magnifiedWidth).toBe(1600);
        expect(zoomService.magnifiedHeight).toBe(1200);
        // expect(zoomService.xRatio).toBe(8);
        // expect(zoomService.yRatio).toBe(8);
    });

    it('should not update lens positions when enableLens is false or latestMouseLeft is not set when calculateImageAndLensPosition is called', () => {
        zoomService.enableLens = false;
        zoomService.lensWidth = 100;
        zoomService.lensHeight = 100;

        zoomService.calculateImageAndLensPosition();

        expect(zoomService.lensLeft).toBe(0);
        expect(zoomService.lensTop).toBe(0);
        expect(zoomService.fullImageLeft).toBe(0);
        expect(zoomService.fullImageTop).toBe(0);

        zoomService.enableLens = true;

        zoomService.calculateImageAndLensPosition();

        expect(zoomService.lensLeft).toBe(0);
        expect(zoomService.lensTop).toBe(0);
        expect(zoomService.fullImageLeft).toBe(0);
        expect(zoomService.fullImageTop).toBe(0);
    });
});
