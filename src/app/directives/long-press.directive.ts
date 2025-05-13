import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
    selector: '[appLongPress]',
    standalone: true
})
export class LongPressDirective {
  @Output() longPress = new EventEmitter<Event>();
  private timeout: number | undefined;
  private duration = 1000; // Duration in milliseconds

  @HostListener('mousedown', ['$event'])
  @HostListener('touchstart', ['$event'])
  onMouseDown(event: Event) {
    this.timeout = window.setTimeout(() => {
      this.longPress.emit(event);
    }, this.duration);
  }

  @HostListener('mouseup')
  @HostListener('mouseleave')
  @HostListener('touchend')
  @HostListener('touchcancel')
  onMouseUp() {
    if (this.timeout) {
      window.clearTimeout(this.timeout);
    }
  }
}