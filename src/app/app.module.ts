import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { NgxImageZoomModule } from 'ngx-image-zoom';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        NgxImageZoomModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
