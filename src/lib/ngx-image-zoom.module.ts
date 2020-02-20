import { NgModule } from '@angular/core';
import { NgxImageZoomComponent } from './ngx-image-zoom.component';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
    declarations: [
        NgxImageZoomComponent,
    ],
    imports: [
        BrowserModule,
    ],
    exports: [
        NgxImageZoomComponent
    ]
})
export class NgxImageZoomModule {
}
