import { NgxImageZoomService } from '../ngx-image-zoom.service';
import { HoverZoomMode } from './hover-zoom-mode';
import SpyObj = jasmine.SpyObj;

describe('HoverZoomMode', () => {
    let zoomMode: HoverZoomMode;
    let zoomServiceMock: SpyObj<NgxImageZoomService>;

    beforeEach(() => {
        zoomServiceMock = jasmine.createSpyObj('NgxImageZoomService', ['zoomOn', 'zoomOff', 'calculateZoomPosition']);

        zoomMode = new HoverZoomMode(zoomServiceMock);
    });

    it('should do nothing on mouse clicks', () => {
        zoomMode.onClick();

        expect(zoomServiceMock.zoomOn).not.toHaveBeenCalled();
        expect(zoomServiceMock.zoomOff).not.toHaveBeenCalled();
        expect(zoomServiceMock.calculateZoomPosition).not.toHaveBeenCalled();
    });

    it('should call zoomOn when mouse enters', () => {
        const eventMock = new MouseEvent('mouseenter');

        zoomMode.onMouseEnter(eventMock);

        expect(zoomServiceMock.zoomOn).toHaveBeenCalledWith(eventMock);
        expect(zoomServiceMock.zoomOff).not.toHaveBeenCalled();
        expect(zoomServiceMock.calculateZoomPosition).not.toHaveBeenCalled();
    });

    it('should call zoomOff when mouse leaves', () => {
        zoomMode.onMouseLeave();

        expect(zoomServiceMock.zoomOff).toHaveBeenCalled();
        expect(zoomServiceMock.zoomOn).not.toHaveBeenCalled();
        expect(zoomServiceMock.calculateZoomPosition).not.toHaveBeenCalled();
    });

    it('should call calculateZoomPosition when mouse moves', () => {
        const eventMock = new MouseEvent('mousemove');

        zoomMode.onMouseMove(eventMock);

        expect(zoomServiceMock.calculateZoomPosition).toHaveBeenCalledWith(eventMock);
        expect(zoomServiceMock.zoomOn).not.toHaveBeenCalled();
        expect(zoomServiceMock.zoomOff).not.toHaveBeenCalled();
    });

    it('should return true for onMouseWheel', () => {
        const result = zoomMode.onMouseWheel();

        expect(result).toBe(true);
    });
});
