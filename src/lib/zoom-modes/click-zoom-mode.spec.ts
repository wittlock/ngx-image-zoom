import { NgxImageZoomService } from '../ngx-image-zoom.service';
import { ClickZoomMode } from './click-zoom-mode';
import SpyObj = jasmine.SpyObj;

describe('ClickZoomMode', () => {
    let zoomMode: ClickZoomMode;
    let zoomServiceMock: SpyObj<NgxImageZoomService>;

    beforeEach(() => {
        zoomServiceMock = jasmine.createSpyObj('NgxImageZoomService', ['zoomOn', 'zoomOff', 'calculateZoomPosition']);

        zoomMode = new ClickZoomMode(zoomServiceMock);
    });

    it('should call zoomOn when clicking and zooming is disabled', () => {
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

    it('should call calculateZoomPosition when mouse moves and zooming is enabled', () => {
        const eventMock = new MouseEvent('mousemove');
        zoomServiceMock.zoomingEnabled = true;

        zoomMode.onMouseMove(eventMock);

        expect(zoomServiceMock.calculateZoomPosition).toHaveBeenCalledWith(eventMock);
        expect(zoomServiceMock.zoomOn).not.toHaveBeenCalled();
        expect(zoomServiceMock.zoomOff).not.toHaveBeenCalled();
    });

    it('should not call calculateZoomPosition when mouse moves and zooming is disabled', () => {
        const eventMock = new MouseEvent('mousemove');
        zoomServiceMock.zoomingEnabled = false;

        zoomMode.onMouseMove(eventMock);

        expect(zoomServiceMock.calculateZoomPosition).not.toHaveBeenCalled();
        expect(zoomServiceMock.zoomOn).not.toHaveBeenCalled();
        expect(zoomServiceMock.zoomOff).not.toHaveBeenCalled();
    });

    it('should return true for onMouseWheel', () => {
        const result = zoomMode.onMouseWheel();

        expect(result).toBe(true);
    });
});
