export abstract class ZoomMode {
    onMouseEnter(event: MouseEvent): void {
        // NOP
    }
    onMouseLeave(event: MouseEvent): void {
        // NOP
    }
    onMouseMove(event: MouseEvent): void {
        // NOP
    }
    onClick(event: MouseEvent): void {
        // NOP
    }
    // Return value decides if we will try to zoom with the wheel event.
    onMouseWheel(event: MouseEvent): boolean {
        return true;
    }
}
