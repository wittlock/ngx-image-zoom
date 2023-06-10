import { NgxImageZoomService } from '../ngx-image-zoom.service';
import { ToggleFreezeZoomMode } from './toggle-freeze-zoom-mode';
import SpyObj = jasmine.SpyObj;

describe('ToggleFreezeZoomMode', () => {
    let zoomMode: ToggleFreezeZoomMode;
    let zoomServiceMock: SpyObj<NgxImageZoomService>;

    beforeEach(() => {
        zoomServiceMock = jasmine.createSpyObj('NgxImageZoomService', [
            'zoomingEnabled',
            'zoomOn',
            'zoomOff',
            'calculateZoomPosition',
            'markForCheck',
        ]);

        zoomMode = new ToggleFreezeZoomMode(zoomServiceMock);
    });

    describe('getting click events', () => {
        const eventMock = new MouseEvent('click');

        it('should call zoomOn when zooming is disabled and clicked for the first time', () => {
            zoomServiceMock.zoomingEnabled = false;

            zoomMode.onClick(eventMock);

            expect(zoomServiceMock.zoomOn).toHaveBeenCalledWith(eventMock);
            expect(zoomServiceMock.zoomOff).not.toHaveBeenCalled();
            expect(zoomServiceMock.markForCheck).not.toHaveBeenCalled();
        });

        it('should call markForCheck when zooming is enabled and clicked while frozen', () => {
            zoomServiceMock.zoomingEnabled = true;

            zoomMode.onClick(eventMock); // Freeze zoom
            zoomMode.onClick(eventMock); // Unfreeze zoom

            expect(zoomServiceMock.zoomOn).not.toHaveBeenCalled();
            expect(zoomServiceMock.zoomOff).toHaveBeenCalled();
            expect(zoomServiceMock.markForCheck).toHaveBeenCalledTimes(1);
        });

        it('should call markForCheck when freezing, zoomOff when unfreezing while zooming is enabled', () => {
            zoomServiceMock.zoomingEnabled = true;

            zoomMode.onClick(eventMock); // Freeze zoom
            expect(zoomServiceMock.markForCheck).toHaveBeenCalledTimes(1);
            expect(zoomServiceMock.zoomOn).not.toHaveBeenCalled();
            expect(zoomServiceMock.zoomOff).not.toHaveBeenCalled();
            zoomServiceMock.markForCheck.calls.reset();

            zoomMode.onClick(eventMock); // Unfreeze zoom
            expect(zoomServiceMock.markForCheck).not.toHaveBeenCalled();
            expect(zoomServiceMock.zoomOn).not.toHaveBeenCalled();
            expect(zoomServiceMock.zoomOff).toHaveBeenCalledTimes(1);
            zoomServiceMock.zoomOff.calls.reset();

            zoomMode.onClick(eventMock); // Freeze zoom again
            expect(zoomServiceMock.markForCheck).toHaveBeenCalledTimes(1);
            expect(zoomServiceMock.zoomOn).not.toHaveBeenCalled();
            expect(zoomServiceMock.zoomOff).not.toHaveBeenCalled();
        });

        it('should call zoomOn when zooming is disabled', () => {
            zoomServiceMock.zoomingEnabled = false;

            zoomMode.onClick(eventMock);

            expect(zoomServiceMock.zoomOn).toHaveBeenCalledWith(eventMock);
            expect(zoomServiceMock.zoomOff).not.toHaveBeenCalled();
            expect(zoomServiceMock.markForCheck).not.toHaveBeenCalled();
        });
    });

    describe('when getting mouseEnter events', () => {
        it('should do nothing', () => {
            zoomMode.onMouseEnter();

            expect(zoomServiceMock.zoomOn).not.toHaveBeenCalled();
            expect(zoomServiceMock.zoomOff).not.toHaveBeenCalled();
            expect(zoomServiceMock.markForCheck).not.toHaveBeenCalled();
            expect(zoomServiceMock.calculateZoomPosition).not.toHaveBeenCalled();
        });
    });

    describe('when getting mouseLeave events', () => {
        it('should call zoomOff when mouse leaves and zooming is enabled and not frozen', () => {
            zoomServiceMock.zoomingEnabled = true;

            zoomMode.onMouseLeave();

            expect(zoomServiceMock.zoomOff).toHaveBeenCalledTimes(1);
        });

        it('should not call zoomOff when mouse leaves and zooming is disabled', () => {
            zoomServiceMock.zoomingEnabled = false;

            zoomMode.onMouseLeave();

            expect(zoomServiceMock.zoomOff).not.toHaveBeenCalled();
        });

        it('should not call zoomOff when mouse leaves and zooming is enabled but frozen', () => {
            zoomServiceMock.zoomingEnabled = true;
            zoomMode.onClick(new MouseEvent('click')); // Freeze zoom

            zoomMode.onMouseLeave();

            expect(zoomServiceMock.zoomOff).not.toHaveBeenCalled();
        });
    });

    describe('when getting mouseMove events', () => {
        const eventMock = new MouseEvent('mousemove');

        it('should call calculateZoomPosition when mouse moves and zooming is enabled and not frozen', () => {
            zoomServiceMock.zoomingEnabled = true;

            zoomMode.onMouseMove(eventMock);

            expect(zoomServiceMock.calculateZoomPosition).toHaveBeenCalledWith(eventMock);
        });

        it('should not call calculateZoomPosition when mouse moves and zooming is enabled while frozen', () => {
            zoomServiceMock.zoomingEnabled = true;
            zoomMode.onClick(new MouseEvent('click')); // Freeze zoom.

            zoomMode.onMouseMove(eventMock);

            expect(zoomServiceMock.calculateZoomPosition).not.toHaveBeenCalled();
        });

        it('should not call calculateZoomPosition when mouse moves and zooming is disabled', () => {
            zoomServiceMock.zoomingEnabled = false;

            zoomMode.onMouseMove(eventMock);

            expect(zoomServiceMock.calculateZoomPosition).not.toHaveBeenCalled();
        });
    });

    describe('getting mousewheel events', () => {
        it('should not allow zooming with mouse wheel when zoom is frozen', () => {
            zoomServiceMock.zoomingEnabled = true;
            zoomMode.onClick(new MouseEvent('click')); // Freeze zoom.

            const allowZoom = zoomMode.onMouseWheel();

            expect(allowZoom).toBeFalse();
        });

        it('should allow zooming with mouse wheel when zoom is not frozen', () => {
            const allowZoom = zoomMode.onMouseWheel();

            expect(allowZoom).toBeTrue();
        });
    });
});
