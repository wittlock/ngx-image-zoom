import { NgModule } from '@angular/core';
import { NgxImageZoomComponent } from './ngx-image-zoom.component';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [
        NgxImageZoomComponent,
    ],
    imports: [
        CommonModule,
    ],
    exports: [
        NgxImageZoomComponent
    ]
})
export class NgxImageZoomModule {
}
