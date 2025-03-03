import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appLongPress]'
})
export class LongPressDirective {
  @Output() longPress = new EventEmitter();
  private timeout: any;
  private duration = 1000; // Duration in milliseconds

  @HostListener('mousedown', ['$event'])
  @HostListener('touchstart', ['$event'])
  onMouseDown(event: any) {
    this.timeout = setTimeout(() => {
      this.longPress.emit(event);
    }, this.duration);
  }

  @HostListener('mouseup')
  @HostListener('mouseleave')
  @HostListener('touchend')
  @HostListener('touchcancel')
  onMouseUp() {
    clearTimeout(this.timeout);
  }
}