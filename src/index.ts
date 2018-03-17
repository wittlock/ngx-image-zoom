import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxImageZoomComponent } from './ngx-image-zoom.component';

export * from './ngx-image-zoom.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        NgxImageZoomComponent
    ],
    exports: [
        NgxImageZoomComponent
    ]
})
export class NgxImageZoomModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: NgxImageZoomModule,
        };
    }
}
