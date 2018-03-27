# ngx-image-zoom

[![npm version](http://img.shields.io/npm/v/ngx-image-zoom.svg)](https://npmjs.org/package/ngx-image-zoom)

## Project status

Still in early development, more features are planned and incoming. Should be in a working 
state right now but it's not tested in lots of different setups yet.

Demonstration of available features available [here](https://wittlock.github.io/ngx-image-zoom/).

## About

NgxImageZoom is inspired by [angular2-image-zoom](https://github.com/brtnshrdr/angular2-image-zoom) and 
JQuery libraries such as [jQuery Zoom](http://www.jacklmoore.com/zoom/) and
[elevateZoom-plus](http://igorlino.github.io/elevatezoom-plus/) but a pure Angular2+ implementation of
similar concepts. This plugin works with both URLs to images and in-line images
([Data URI](https://en.wikipedia.org/wiki/Data_URI_scheme)).

## Available options

All settings except *thumbImage* are optional. If no *fullImage* is provided the thumbImage will be
used as the high resolution version as well.

Option | Default&#160;value | Description
:---:|:---:|---
thumbImage | *none* | (Required) The smaller version of the image that will be shown when there's no interaction by the user.
fullImage | *none* | The full resolution version of the image to be used when zooming. If not supplied thumbImage will be used.
magnification | 1 | The zoom factor to be used by default. 1 means we use the fullImage at its actual resolution.
zoomMode | 'hover' | The mode of zooming to use, these are explained in a table below.
enableScrollZoom | false | Boolean that toggles if the mouse wheel should be captured when hovering over the image to adjust magnification.
scrollStepSize | 0.1 | When using scroll zoom this setting determines how big steps each scroll changes the zoom. 
enableLens | false | If enabled only a small portion around the mouse cursor will actually magnify instead of the entire image area.
lensWidth | 100 | Width of the lens, if enabled.
lensHeight | 100 | Height of the lens, if enabled.
circularLens | false | Make the lens circular instead of square. This will only look good if width and height are equal.
minZoomRatio | *baseRatio* | Lower limit on how much zoom can be applied with scrollZoom enabled. See below for details.
maxZoomRatio | 2 | Upper limit on how much zoom can be applied with scrollZoom enabled. See below for details.

### Zoom modes
Mode | Description
:---:|---
hover | Whenever the mouse cursor moves over the thumbnail it will show the zoomed image until it leaves the thumbnail.
click | Similar to hover but it only starts zooming if the user clicks the image. Moving the cursor away from the image disables it again.
toggle | A click in the image will zoom at the point of the cursor. Another click will restore the small image.
hover-freeze | First click enables hover mode, second click freezes the zoomed image where it is, third click restores thumbnail.

### Zoom ratio
The zoom ratio used in the *minZoomRatio* and *maxZoomRatio* settings refer to the relative size of the thumbnail
and the full size image. The *baseRatio* default value is the calculated ratio that would make the zoomed image equal
in size to the thumbnail. For example, if the full size image is 10x larger than the thumbnail, then *minZoomRatio* will
default to *0.1*, as in the full size image can at its smallest be shown at 0.1 times its original size. The default
value for *maxZoomRatio* being *1* means the largest the fullSize image can appear is twice its original size. 

## Available output

The component outputs the follow events that can be triggered on.

Event&#160;name | Description
:---:|---
onZoomScroll | Whenever the user changes the zoom level using the scroll wheel this event will fire with the current zoom ratio (see above).
onZoomPosition | When the point on where the zoom is focused changes this event emits a Coord event (interface exported from the module) with X/Y in pixels relative thumbnails top left corner. Practically whenever the user moves the mouse cursor over the image.

## Installation

To install this library, run:

```bash
$ npm install ngx-image-zoom --save
```

## Using this library

From your Angular `AppModule`:

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

// Import the library
import { NgxImageZoomModule } from 'ngx-image-zoom';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgxImageZoomModule.forRoot() // <-- Add this line
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

Once the library is imported, you can use its component in your Angular application:

```xml
<!-- You can now use NgxImageZoom component in app.component.html -->
<h1>
  {{title}}
</h1>
<ngx-image-zoom
    [thumbImage]=myThumbnail
    [fullImage]=myFullresImage
></ngx-image-zoom>
```

## License

MIT © Mathias Wittlock
