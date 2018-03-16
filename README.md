# ngx-image-zoom

## Project status

Still in early development, documentation is lacking still.

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
    [thumbImage]="my-thumbnail.jpg"
    [fullImage]="my-fullres-image.jpg"
></ngx-image-zoom>
```


## License

MIT © Mathias Wittlock
