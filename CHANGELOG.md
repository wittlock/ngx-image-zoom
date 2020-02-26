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
