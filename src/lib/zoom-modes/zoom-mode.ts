export interface ZoomMode {
    onClick(event: MouseEvent): void;
    onMouseEnter(event: MouseEvent): void;
    onMouseLeave(event: MouseEvent): void;
    onMouseMove(event: MouseEvent): void;
    // Return value decides if we will try to zoom with the wheel event.
    onMouseWheel(event: MouseEvent): boolean;
}
