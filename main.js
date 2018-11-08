(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "./package.json":
/*!**********************!*\
  !*** ./package.json ***!
  \**********************/
/*! exports provided: name, version, license, scripts, private, dependencies, devDependencies, default */
/***/ (function(module) {

module.exports = {"name":"ngx-image-zoom-demo","version":"0.0.0","license":"MIT","scripts":{"ng":"ng","start":"ng serve","build":"ng build --prod --base-href=/ngx-image-zoom/","test":"ng test","lint":"ng lint","e2e":"ng e2e"},"private":true,"dependencies":{"@angular/animations":"7.0.3","@angular/common":"7.0.3","@angular/compiler":"7.0.3","@angular/core":"7.0.3","@angular/forms":"7.0.3","@angular/http":"7.0.3","@angular/platform-browser":"7.0.3","@angular/platform-browser-dynamic":"7.0.3","@angular/router":"7.0.3","core-js":"^2.4.1","ngx-image-zoom":"0.3.3","rxjs":"^6.3.3","zone.js":"^0.8.26"},"devDependencies":{"@angular-devkit/build-angular":"^0.10.4","@angular/cli":"7.0.4","@angular/compiler-cli":"7.0.3","@angular/language-service":"7.0.3","@types/jasmine":"~2.8.3","@types/jasminewd2":"~2.0.2","@types/node":"~6.0.60","codelyzer":"^4.0.1","jasmine-core":"~2.8.0","jasmine-spec-reporter":"~4.2.1","karma":"~2.0.0","karma-chrome-launcher":"~2.2.0","karma-coverage-istanbul-reporter":"^1.2.1","karma-jasmine":"~1.1.0","karma-jasmine-html-reporter":"^0.2.2","protractor":"~5.1.2","ts-node":"~4.1.0","tslint":"~5.9.1","typescript":"3.1.6"}};

/***/ }),

/***/ "./src/$$_lazy_route_resource lazy recursive":
/*!**********************************************************!*\
  !*** ./src/$$_lazy_route_resource lazy namespace object ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./src/$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./src/app/app.component.css":
/*!***********************************!*\
  !*** ./src/app/app.component.css ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2FwcC5jb21wb25lbnQuY3NzIn0= */"

/***/ }),

/***/ "./src/app/app.component.html":
/*!************************************!*\
  !*** ./src/app/app.component.html ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container\">\n    <h4>NgxImageZoom mode demo</h4>\n    <p>\n        Below follows a couple of example of the various settings that can be used with NgxImageZoom. Most of these\n        settings can be combined freely in more ways than are shown here.<br/>\n        This demo is running on NgxImageZoom version {{ ngxImageZoomVersion }}\n    </p>\n    <table class=\"table\">\n        <tr *ngFor=\"let mode of modes\">\n            <td>\n                <ul>\n                    <li *ngIf=\"mode.zoomMode\">Zoom mode: <em>{{ mode.zoomMode }}</em></li>\n                    <li *ngIf=\"mode.scrollZoom\">Scroll zooming: <em>enabled</em></li>\n                    <li *ngIf=\"mode.magnification != 1\">Magnification: <em>{{ mode.magnification }}</em></li>\n                    <li *ngIf=\"mode.lensMode\">Lens mode: <em>enabled</em></li>\n                    <li *ngIf=\"mode.lensWidth\">Lens width: <em>{{ mode.lensWidth }}</em></li>\n                    <li *ngIf=\"mode.lensHeight\">Lens height: <em>{{ mode.lensHeight }}</em></li>\n                    <li *ngIf=\"mode.circularLens\">Circular lens: <em>enabled</em></li>\n                </ul>\n            </td>\n            <td>\n                <ngx-image-zoom\n                    [thumbImage]=thumbImage\n                    [fullImage]=fullImage\n                    [zoomMode]=mode.zoomMode\n                    [magnification]=mode.magnification\n                    [enableScrollZoom]=mode.scrollZoom\n                    [enableLens]=mode.lensMode\n                    [lensWidth]=mode.lensWidth\n                    [lensHeight]=mode.lensHeight\n                    [circularLens]=mode.circularLens\n                ></ngx-image-zoom>\n            </td>\n        </tr>\n\n        <tr>\n            <td>\n                <ul>\n                    <li>Zoom mode: <em>hover</em></li>\n                    <li>Scroll zooming: <em>enabled</em></li>\n                    <li>Lens mode: <em>enabled</em></li>\n                </ul>\n                Module output:\n                <ul>\n                    <li>Magnification: {{ zoomScrollValue | number: '1.0-2' }}</li>\n                    <li>Cursor position:\n                        <ul>\n                            <li>X: {{ zoomCoords?.x | number: '1.0-2' }}</li>\n                            <li>Y: {{ zoomCoords?.y | number: '1.0-2' }}</li>\n                        </ul>\n                    </li>\n                </ul>\n            </td>\n            <td>\n                <ngx-image-zoom\n                    [thumbImage]=thumbImage\n                    [fullImage]=fullImage\n                    zoomMode=\"hover\"\n                    enableScrollZoom=\"true\"\n                    enableLens=true\n                    (onZoomScroll)=\"zoomScroll($event)\"\n                    (onZoomPosition)=\"zoomPosition($event)\"\n                ></ngx-image-zoom>\n            </td>\n        </tr>\n\n        <tr>\n            <td colspan=\"2\">\n                <p class=\"font-weight-light text-center\">\n                    Image courtesy of pexels.com under CC0 license.\n                </p>\n            </td>\n        </tr>\n    </table>\n</div>\n"

/***/ }),

/***/ "./src/app/app.component.ts":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../environments/environment */ "./src/environments/environment.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var AppComponent = /** @class */ (function () {
    function AppComponent() {
        this.thumbImage = 'assets/thumb.jpg';
        this.fullImage = 'assets/fullres.jpg';
        this.modes = [];
        this.ngxImageZoomVersion = _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].VERSION;
        this.modes.push({
            zoomMode: 'hover',
            magnification: 1
        });
        this.modes.push({
            zoomMode: 'click',
            scrollZoom: true,
            magnification: 1
        });
        this.modes.push({
            zoomMode: 'click',
            lensMode: true,
            lensWidth: 150,
            lensHeight: 150,
            circularLens: true,
            magnification: 1
        });
        this.modes.push({
            zoomMode: 'toggle',
            magnification: 0.5
        });
        this.modes.push({
            zoomMode: 'hover-freeze',
            lensMode: true,
            lensWidth: 163,
            lensHeight: 100,
            scrollZoom: true,
            magnification: 1
        });
    }
    AppComponent.prototype.zoomScroll = function (event) {
        this.zoomScrollValue = event;
    };
    AppComponent.prototype.zoomPosition = function (event) {
        this.zoomCoords = event;
    };
    AppComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-root',
            template: __webpack_require__(/*! ./app.component.html */ "./src/app/app.component.html"),
            styles: [__webpack_require__(/*! ./app.component.css */ "./src/app/app.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], AppComponent);
    return AppComponent;
}());



/***/ }),

/***/ "./src/app/app.module.ts":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app.component */ "./src/app/app.component.ts");
/* harmony import */ var ngx_image_zoom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ngx-image-zoom */ "./node_modules/ngx-image-zoom/ngx-image-zoom.umd.js");
/* harmony import */ var ngx_image_zoom__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(ngx_image_zoom__WEBPACK_IMPORTED_MODULE_3__);
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: [
                _app_component__WEBPACK_IMPORTED_MODULE_2__["AppComponent"]
            ],
            imports: [
                _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
                ngx_image_zoom__WEBPACK_IMPORTED_MODULE_3__["NgxImageZoomModule"].forRoot()
            ],
            providers: [],
            bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_2__["AppComponent"]]
        })
    ], AppModule);
    return AppModule;
}());



/***/ }),

/***/ "./src/environments/environment.ts":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
var environment = {
    production: false,
    VERSION: __webpack_require__(/*! ../../package.json */ "./package.json").dependencies['ngx-image-zoom']
};


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser-dynamic */ "./node_modules/@angular/platform-browser-dynamic/fesm5/platform-browser-dynamic.js");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "./src/app/app.module.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./environments/environment */ "./src/environments/environment.ts");




if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
}
Object(_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__["platformBrowserDynamic"])().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
    .catch(function (err) { return console.log(err); });


/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! C:\code\ngx-image-zoom-demo\src\main.ts */"./src/main.ts");


/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map