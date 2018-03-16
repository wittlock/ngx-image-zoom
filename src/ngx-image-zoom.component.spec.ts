import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {} from 'jasmine';

import { NgxImageZoomComponent } from './ngx-image-zoom.component';

describe('NgxImageZoomComponent', () => {
    let component: NgxImageZoomComponent;
    let fixture: ComponentFixture<NgxImageZoomComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [NgxImageZoomComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NgxImageZoomComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
