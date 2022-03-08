import { createPopper, Instance } from '@popperjs/core';
import {
  Component,
  Element,
  h,
  Host,
  JSX,
  Listen,
  State,
  Watch
} from '@stencil/core';

import { trackComponent } from '../../../usage-tracking';

import {
  HTMLGuxMenuItemElement,
  hideDelay,
  moveFocusDelay
} from './gux-menu/gux-menu.common';

@Component({
  styleUrl: 'gux-flyout-menu.less',
  tag: 'gux-flyout-menu-beta'
})
export class GuxFlyoutMenu {
  private hideDelayTimeout: NodeJS.Timer;
  private popperInstance: Instance;
  private targetElement: HTMLSpanElement;
  private menuElement: HTMLDivElement;
  private menuContentElement: HTMLDivElement;

  @Element()
  private root: HTMLElement;

  @State()
  private isShown: boolean = false;

  @Watch('isShown')
  forceUpdate(isShown: boolean) {
    if (isShown) {
      if (this.popperInstance) {
        void this.popperInstance.update();
      }
    }
  }

  @Listen('keydown')
  onKeydown(event: KeyboardEvent): void {
    event.stopPropagation();

    if (this.isShown) {
      switch (event.key) {
        case 'Escape':
        case 'ArrowLeft':
        case 'ArrowUp':
          this.root.focus();
          return;

        case 'ArrowDown':
          event.preventDefault();
          this.focusOnMenu();
          return;

        case 'Enter':
          this.hideDelayTimeout = setTimeout(() => {
            this.focusOnMenu();
          }, moveFocusDelay);
          return;
      }
    }
  }

  // Using 'keyup' here because the native click handler behavior
  // for buttons is triggered on keyup when using the space key
  @Listen('keyup')
  onKeyup(event: KeyboardEvent): void {
    event.stopPropagation();
    switch (event.key) {
      case ' ':
        if (this.menuContentElement.contains(document.activeElement)) {
          this.root.focus();
        } else {
          this.hideDelayTimeout = setTimeout(() => {
            this.focusOnMenu();
          }, moveFocusDelay);
        }
        return;
    }
  }

  @Listen('mouseenter')
  onmouseenter() {
    this.show();
  }

  @Listen('mouseleave')
  onMouseleave() {
    this.hide();
  }

  @Listen('click')
  onClick(event: MouseEvent) {
    if (event.detail !== 0) {
      this.hide();
    }
    this.root.focus();
  }

  @Listen('focusin')
  onFocusin() {
    this.show();
  }

  @Listen('focusout')
  onFocusout() {
    this.hide();
  }

  private show(): void {
    clearTimeout(this.hideDelayTimeout);
    this.isShown = true;
  }

  private hide(): void {
    if (this.isShown) {
      this.hideDelayTimeout = setTimeout(() => {
        this.isShown = false;
      }, hideDelay);
    }
  }

  private runPopper(): void {
    this.popperInstance = createPopper(this.targetElement, this.menuElement, {
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, 16]
          }
        },
        {
          name: 'arrow',
          options: {
            padding: 16 // 16px from the edges of the popper
          }
        }
      ],
      placement: 'bottom-start'
    });
  }

  private destroyPopper(): void {
    if (this.popperInstance) {
      this.popperInstance.destroy();
      this.popperInstance = null;
    }
  }

  private focusOnMenu(): void {
    if (this.menuContentElement.contains(document.activeElement)) {
      return;
    }

    const menu = this.menuContentElement.querySelector('gux-menu');
    const menuItems = Array.from(menu.children);
    const nextFocusableElement = menuItems[0] as HTMLGuxMenuItemElement;

    void nextFocusableElement.guxFocus();
  }

  componentWillLoad(): void {
    trackComponent(this.root);
  }

  componentDidLoad(): void {
    this.runPopper();
  }

  disconnectedCallback(): void {
    this.destroyPopper();
  }

  render(): JSX.Element {
    return (
      <Host
        tabIndex={0}
        aria-haspopup="true"
        aria-expanded={this.isShown.toString()}
      >
        <span ref={el => (this.targetElement = el)}>
          <slot name="target" />
        </span>
        <div
          ref={el => (this.menuElement = el)}
          class={{
            'gux-flyout-menu-wrapper': true,
            'gux-shown': this.isShown
          }}
        >
          <div
            class="gux-flyout-menu-content"
            ref={el => (this.menuContentElement = el)}
          >
            <slot name="menu" />
          </div>
          <div class="gux-arrow" data-popper-arrow />
        </div>
      </Host>
    ) as JSX.Element;
  }
}
