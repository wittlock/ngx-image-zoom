import { NgxImageZoomService } from '../ngx-image-zoom.service';
import { ToggleZoomMode } from './toggle-zoom-mode';
import SpyObj = jasmine.SpyObj;

describe('ToggleZoomMode', () => {
    let zoomMode: ToggleZoomMode;
    let zoomServiceMock: SpyObj<NgxImageZoomService>;

    beforeEach(() => {
        zoomServiceMock = jasmine.createSpyObj('NgxImageZoomService', ['zoomOn', 'zoomOff', 'calculateZoomPosition']);

        zoomMode = new ToggleZoomMode(zoomServiceMock);
    });

    it('should call zoomOff when clicking while zooming is enabled', () => {
        const eventMock = new MouseEvent('click');
        zoomServiceMock.zoomingEnabled = true;

        zoomMode.onClick(eventMock);

        expect(zoomServiceMock.zoomOff).toHaveBeenCalled();
        expect(zoomServiceMock.zoomOn).not.toHaveBeenCalled();
        expect(zoomServiceMock.calculateZoomPosition).not.toHaveBeenCalled();
    });

    it('should call zoomOn when clicking while zooming is disabled', () => {
        const eventMock = new MouseEvent('click');
        zoomServiceMock.zoomingEnabled = false;

        zoomMode.onClick(eventMock);

        expect(zoomServiceMock.zoomOn).toHaveBeenCalledWith(eventMock);
        expect(zoomServiceMock.zoomOff).not.toHaveBeenCalled();
        expect(zoomServiceMock.calculateZoomPosition).not.toHaveBeenCalled();
    });

    it('should not do anything for onMouseEnter', () => {
        zoomMode.onMouseEnter();

        expect(zoomServiceMock.zoomOn).not.toHaveBeenCalled();
        expect(zoomServiceMock.zoomOff).not.toHaveBeenCalled();
        expect(zoomServiceMock.calculateZoomPosition).not.toHaveBeenCalled();
    });

    it('should not do anything for onMouseLeave', () => {
        zoomMode.onMouseLeave();

        expect(zoomServiceMock.zoomOff).not.toHaveBeenCalled();
        expect(zoomServiceMock.zoomOn).not.toHaveBeenCalled();
        expect(zoomServiceMock.calculateZoomPosition).not.toHaveBeenCalled();
    });

    it('should not do anything for onMouseMove', () => {
        zoomMode.onMouseMove();

        expect(zoomServiceMock.calculateZoomPosition).not.toHaveBeenCalled();
        expect(zoomServiceMock.zoomOn).not.toHaveBeenCalled();
        expect(zoomServiceMock.zoomOff).not.toHaveBeenCalled();
    });

    it('should return true for onMouseWheel', () => {
        const result = zoomMode.onMouseWheel();

        expect(result).toBe(true);
    });
});
