import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  JSX,
  Listen,
  Prop,
  Watch
} from '@stencil/core';

import { trackComponent } from '../../../usage-tracking';
import { OnClickOutside } from '../../../utils/decorator/on-click-outside';

import { buildI18nForComponent, GetI18nValue } from '../../../i18n';
import { GuxButtonAccent, GuxButtonType } from '../gux-button/gux-button.types';

import defaultResources from './i18n/en.json';

@Component({
  styleUrl: 'gux-action-button.less',
  tag: 'gux-action-button',
  shadow: true
})
export class GuxActionButton {
  private listElement: HTMLGuxListElement;
  private dropdownButton: HTMLElement;
  private moveFocusDelay: number = 100;
  private i18n: GetI18nValue;

  @Element()
  private root: HTMLElement;
  listboxElement: HTMLGuxListboxElement;
  buttonListElement: HTMLGuxButtonListElement

  /**
   * The component button type
   */
  @Prop()
  type: GuxButtonType = 'button';

  /**
   * Triggered when the menu is open
   */
  @Event()
  open: EventEmitter;

  /**
   * Triggered when the menu is close
   */
  @Event()
  close: EventEmitter;

  /**
   * Triggered when the action button is clicked
   */
  @Event()
  actionClick: EventEmitter;

  /**
   * The component text.
   */
  @Prop()
  text: string;

  /**
   * Disables the action button.
   */
  @Prop()
  disabled: boolean = false;

  /**
   * The component accent (secondary or primary).
   */
  @Prop()
  accent: GuxButtonAccent = 'secondary';

  /**
   * It is used to open or not the list.
   */
  @Prop({ mutable: true })
  expanded: boolean = false;

  @Listen('keydown')
  handleKeydown(event: KeyboardEvent): void {
    const composedPath = event.composedPath();

    switch (event.key) {
      case 'Escape':
        this.expanded = false;
        if (composedPath.includes(this.listElement)) {
          this.dropdownButton.focus();
        }
        break;
      // case 'Tab': {
      //   this.expanded = false;
      //   break;
      // }
      case 'ArrowDown':
        event.preventDefault();
        if (composedPath.includes(this.dropdownButton)) {
          this.expanded = true;
          setTimeout(() => {
            void this.buttonListElement.setFocusOnFirstItem();
          }, this.moveFocusDelay);
        }
        if (document.activeElement !== this.buttonListElement) {
          event.preventDefault();
          this.expanded = true;
          if (this.buttonListElement) {
            setTimeout(() => {
              this.buttonListElement.focus();
            }, this.moveFocusDelay);
          }
        }
        break;
      case 'Enter':
        // if (composedPath.includes(this.dropdownButton)) {
        //   setTimeout(() => {
        //     void this.listElement.setFocusOnFirstItem();
        //   }, this.moveFocusDelay);
        // }
        if (this.buttonListElement) {
          setTimeout(() => {
            this.buttonListElement.focus();
          }, this.moveFocusDelay);
        }
        break;
    }
  }

  @Listen('keyup')
  handleKeyup(event: KeyboardEvent): void {

    switch (event.key) {
      case ' ':
        // if (composedPath.includes(this.dropdownButton)) {
        //   setTimeout(() => {
        //     void this.listElement.setFocusOnFirstItem();
        //   }, this.moveFocusDelay);
        // }
        if (this.buttonListElement) {
          setTimeout(() => {
            this.buttonListElement.focus();
          }, this.moveFocusDelay);
        }
        break;
    }
  }

  @Watch('disabled')
  watchDisabled(disabled: boolean): void {
    if (disabled) {
      this.expanded = false;
    }
  }

  @Watch('expanded')
  watchValue(expanded: boolean): void {
    if (expanded) {
      this.open.emit();
    } else {
      this.close.emit();
    }
  }

  @OnClickOutside({ triggerEvents: 'click' })
  onClickOutside(event): void {
  //   console.log(event.relatedTarget)
        if (event.relatedTarget === null) {

    this.expanded = false;
  }
  }

  private toggle(): void {
    if (!this.disabled) {
      this.expanded = !this.expanded;
    }
  }

  private onListboxElementFocusout(): void {
    this.expanded = false;
  }

  private onActionClick(): void {
    if (!this.disabled) {
      this.expanded = false;
      this.actionClick.emit();
    }
  }

  // private onListElementFocusout(event: FocusEvent): void {
  //   if (event.relatedTarget !== null && !this.root.matches(':focus-within')) {
  //     this.expanded = false;
  //   }
  // }

  async componentWillLoad(): Promise<void> {
    trackComponent(this.root, { variant: this.type });
    this.i18n = await buildI18nForComponent(this.root, defaultResources);
    this.buttonListElement = this.root.querySelector('gux-button-list');
  }

  componentDidLoad(): void {
    if (!this.listboxElement?.getAttribute('aria-label')) {
      this.listboxElement?.setAttribute('aria-label', this.text);
    }
    this.listboxElement?.addEventListener(
      'focusout',
      this.onListboxElementFocusout.bind(this)
    );
  }

  render(): JSX.Element {
    return (
      <div class="gux-action-button-container">
        <gux-popup-beta expanded={this.expanded} disabled={this.disabled}>
          <div slot="target" class="gux-action-button-container">
            <gux-button-slot-beta
              class="gux-action-button"
              accent={this.accent}
            >
              <button
                type={this.type}
                disabled={this.disabled}
                onClick={() => this.onActionClick()}
              >
                {this.text}
              </button>
            </gux-button-slot-beta>

            <gux-button-slot-beta
              class="gux-dropdown-button"
              accent={this.accent}
            >
              <button
                type={this.type}
                disabled={this.disabled}
                ref={el => (this.dropdownButton = el)}
                onClick={() => this.toggle()}
                aria-haspopup="listbox"
                aria-expanded={this.expanded.toString()}
                aria-label={this.i18n('actionButtonDropdown', {
                  buttonTitle: this.text
                })}
              >
                <gux-icon decorative icon-name="chevron-small-down"></gux-icon>
              </button>
            </gux-button-slot-beta>
          </div>

          <gux-button-list
            slot="popup"
            // onFocusout={this.onListElementFocusout.bind(this)}
            ref={el => (this.buttonListElement = el)}
          >
          {/* <div slot="popup"> */}
              <slot />
          {/* </div> */}
          </gux-button-list>
        </gux-popup-beta>
      </div>
    ) as JSX.Element;
  }
}
