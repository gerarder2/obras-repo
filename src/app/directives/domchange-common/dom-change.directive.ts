import { Directive, ElementRef, EventEmitter, OnDestroy, Output } from '@angular/core';

@Directive({
  selector: '[appDomChange]'
})
export class DomChangeDirective implements OnDestroy {
  @Output()
  domChange = new EventEmitter();

  private changes: MutationObserver;

  constructor(private elementRef: ElementRef) {
    const element = this.elementRef.nativeElement;

    this.changes = new MutationObserver((mutations: MutationRecord[]) => {
      mutations.forEach((mutation: MutationRecord) => {
        // this.domChange.emit(mutation);
        console.warn(mutation.type);
      });
    });

    this.changes.observe(element, {
      attributes: true,
      childList: true,
      characterData: true
    });
  }

  ngOnDestroy(): void {
    this.changes.disconnect();
  }
}
