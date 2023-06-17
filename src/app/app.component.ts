import { Component } from '@angular/core';
import { DemoSetting } from './demo-setting';
import { environment } from '../environments/environment';
import { Coord } from 'ngx-image-zoom';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    thumbImage = 'assets/thumb.jpg';
    fullImage = 'assets/fullres.jpg';

    modes: DemoSetting[] = [];

    ngxImageZoomVersion = environment.VERSION;

    zoomScrollValue!: number;
    zoomCoords: Coord | null = null;

    constructor() {
        this.modes.push({
            zoomMode: 'hover',
            magnification: 1,
            circularLens: false, lensHeight: 0, lensMode: false, lensWidth: 0, scrollZoom: false
        });
        this.modes.push({
            zoomMode: 'click',
            scrollZoom: true,
            magnification: 1,
            circularLens: false, lensHeight: 0, lensMode: false, lensWidth: 0
        });
        this.modes.push({
            zoomMode: 'click',
            lensMode: true,
            lensWidth: 150,
            lensHeight: 150,
            circularLens: true,
            magnification: 1,
            scrollZoom: false
        });
        this.modes.push({
            zoomMode: 'toggle',
            magnification: 0.5,
            circularLens: false, lensHeight: 0, lensMode: false, lensWidth: 0, scrollZoom: false
        });
        this.modes.push({
            zoomMode: 'hover-freeze',
            lensMode: true,
            lensWidth: 163,
            lensHeight: 100,
            scrollZoom: true,
            magnification: 1,
            circularLens: false
        });
        this.modes.push({
            zoomMode: 'toggle-freeze',
            lensMode: true,
            lensWidth: 150,
            lensHeight: 150,
            scrollZoom: true,
            magnification: 1,
            circularLens: false
        });
    }

    zoomScroll(event: number) {
        this.zoomScrollValue = event;
    }

    zoomPosition(event: Coord) {
        this.zoomCoords = event;
    }
}
