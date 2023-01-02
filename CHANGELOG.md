<a name="1.2.0"></a>
# 1.2.0

### Breaking changes
* To implements 'toggle-freeze' as was 'hover-freeze' and does 'hover-freeze' without needing to click to zoom: Whenever the mouse cursor moves over the thumbnail it will show the zoomed image, first click freezes the zoomed image where it is, second click unfreeze thumbnail:
    * Demonstration of available features available in ([v1.0.1](https://stackblitz.com/edit/angular-image-zoom-1i9alv?file=src/app/app.component.html))
    * Demonstration of available features available in ([v1.2.0](https://ngx-image-zoom.web.app/))

<a name="1.0.1"></a>
# 1.0.1

 ### Features
 * Added `alt` and `title` attributes to the thumb and full image with `altText` and `titleText` inputs.
 

<a name="1.0.0"></a>
# 1.0.0

### Features
* Updated for latest Angular
* Merged PR#88 for toggle-click zoom mode
* Added additional @Output, imagesLoaded, showing the value of isReady. Which is true when both thumbnail and fullImage is loaded 

<a name="0.6.0"></a>
# 0.6.0

### Breaking changes
* Removed input parameters *scrollParentSelector* and *isInsideStaticContainer* as I believe these are no longer needed.

### Features
* Rewrote the zooming position calculations, it feels much more robust now and will hopefully perform as expected in
more situations with complex layouts.

<a name="0.5.1"></a>
# 0.5.1

### Bugfixes
* Replaced BrowserModule with CommonModule. ([Angular guide](https://angular.io/guide/frequent-ngmodules#browsermodule-and-commonmodule))

<a name="0.5.0"></a>
# 0.5.0

### Breaking changes
* To comply with recommendaing naming conventions the follow name changes have been done:
    * Changed tag name from *ngx-image-zoom* to *lib-ngx-image-zoom* ([style 02-07](https://angular.io/guide/styleguide#style-02-07))
    * Changed output *onZoomScroll* to *zoomScroll* ([style 05-16](https://angular.io/guide/styleguide#style-05-16))
    * Changed output *onZoomPosition* to *zoomPosition* ([style 05-16](https://angular.io/guide/styleguide#style-05-16))
* With the upgrade *.forRoot()* is no longer needed when importing the NgxImageZoomModule in your project.

### Features
* Completely redid the library wrapping for Angular 9 support.
* Library is now in Angular Package Format for better compatibility.
* Added a new input scrollParentSelector to further control zooming in complex layouts.

### Bugfixes
* Clean up event listeners when component is destroyed.
