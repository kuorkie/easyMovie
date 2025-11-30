import {Directive, ElementRef, HostListener, Input, Renderer2} from '@angular/core';

@Directive({
  selector: 'img[appImgNotFound]'
})
export class ImgNotFoundDirective {


  private alreadyFailed = false;

  constructor(
    private el: ElementRef<HTMLImageElement>,
    private renderer: Renderer2
  ) {}

  @HostListener('error')
  onError() {
    const img = this.el.nativeElement;

    if (!this.alreadyFailed ) {
      this.alreadyFailed = true;
      this.renderer.setAttribute(img, 'src', '/not-found.png');
    }
  }
}
