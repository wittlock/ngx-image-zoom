<a name="2.1.0"></a>

# 2.1.0

### Features

-   Added SafeUrl as data type for thumbImage and fullImage.

<a name="2.0.0"></a>

# 2.0.0

### Breaking changes

-   'hover-freeze' has changed name to 'toggle-freeze', a more descriptive name. And a new mode has been added called 'hover-freeze', see README for description.
    -   Demonstration of available features available in ([v2.0.0](https://wittlock.github.io/ngx-image-zoom/))

<a name="1.0.1"></a>

# 1.0.1

### Features

-   Added `alt` and `title` attributes to the thumb and full image with `altText` and `titleText` inputs.

<a name="1.0.0"></a>

# 1.0.0

### Features

-   Updated for latest Angular
-   Merged PR#88 for toggle-click zoom mode
-   Added additional @Output, imagesLoaded, showing the value of isReady. Which is true when both thumbnail and fullImage is loaded

<a name="0.6.0"></a>

# 0.6.0

### Breaking changes

-   Removed input parameters _scrollParentSelector_ and _isInsideStaticContainer_ as I believe these are no longer needed.

### Features

-   Rewrote the zooming position calculations, it feels much more robust now and will hopefully perform as expected in
    more situations with complex layouts.

<a name="0.5.1"></a>

# 0.5.1

### Bugfixes

-   Replaced BrowserModule with CommonModule. ([Angular guide](https://angular.io/guide/frequent-ngmodules#browsermodule-and-commonmodule))

<a name="0.5.0"></a>

# 0.5.0

### Breaking changes

-   To comply with recommendaing naming conventions the follow name changes have been done:
    -   Changed tag name from _ngx-image-zoom_ to _lib-ngx-image-zoom_ ([style 02-07](https://angular.io/guide/styleguide#style-02-07))
    -   Changed output _onZoomScroll_ to _zoomScroll_ ([style 05-16](https://angular.io/guide/styleguide#style-05-16))
    -   Changed output _onZoomPosition_ to _zoomPosition_ ([style 05-16](https://angular.io/guide/styleguide#style-05-16))
-   With the upgrade _.forRoot()_ is no longer needed when importing the NgxImageZoomModule in your project.

### Features

-   Completely redid the library wrapping for Angular 9 support.
-   Library is now in Angular Package Format for better compatibility.
-   Added a new input scrollParentSelector to further control zooming in complex layouts.

### Bugfixes

-   Clean up event listeners when component is destroyed.
