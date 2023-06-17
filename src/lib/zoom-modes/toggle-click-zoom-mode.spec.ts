import { NgxImageZoomService } from '../ngx-image-zoom.service';
import { ToggleClickZoomMode } from './toggle-click-zoom-mode';
import SpyObj = jasmine.SpyObj;

describe('ToggleClickZoomMode', () => {
    let zoomMode: ToggleClickZoomMode;
    let zoomServiceMock: SpyObj<NgxImageZoomService>;

    beforeEach(() => {
        zoomServiceMock = jasmine.createSpyObj('NgxImageZoomService', ['zoomOn', 'zoomOff', 'calculateZoomPosition']);

        zoomMode = new ToggleClickZoomMode(zoomServiceMock);
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

    it('should do nothing when mouse enters', () => {
        zoomMode.onMouseEnter();

        expect(zoomServiceMock.zoomOn).not.toHaveBeenCalled();
        expect(zoomServiceMock.zoomOff).not.toHaveBeenCalled();
        expect(zoomServiceMock.calculateZoomPosition).not.toHaveBeenCalled();
    });

    it('should call zoomOff when mouse leaves', () => {
        zoomMode.onMouseLeave();

        expect(zoomServiceMock.zoomOff).toHaveBeenCalled();
        expect(zoomServiceMock.zoomOn).not.toHaveBeenCalled();
        expect(zoomServiceMock.calculateZoomPosition).not.toHaveBeenCalled();
    });

    it('should call calculateZoomPosition when mouse moves while zooming is enabled', () => {
        const eventMock = new MouseEvent('mousemove');
        zoomServiceMock.zoomingEnabled = true;

        zoomMode.onMouseMove(eventMock);

        expect(zoomServiceMock.calculateZoomPosition).toHaveBeenCalledWith(eventMock);
        expect(zoomServiceMock.zoomOn).not.toHaveBeenCalled();
        expect(zoomServiceMock.zoomOff).not.toHaveBeenCalled();
    });

    it('should not call calculateZoomPosition when mouse moves while zooming is disabled', () => {
        const eventMock = new MouseEvent('mousemove');
        zoomServiceMock.zoomingEnabled = false;

        zoomMode.onMouseMove(eventMock);

        expect(zoomServiceMock.zoomOn).not.toHaveBeenCalled();
        expect(zoomServiceMock.zoomOff).not.toHaveBeenCalled();
        expect(zoomServiceMock.calculateZoomPosition).not.toHaveBeenCalled();
    });

    it('should return true for onMouseWheel', () => {
        const result = zoomMode.onMouseWheel();

        expect(result).toBe(true);
    });
});
