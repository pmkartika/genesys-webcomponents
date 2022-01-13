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
import {
  GuxButtonAccent,
  GuxButtonType
} from '../../stable/gux-button/gux-button.types';

import defaultResources from './i18n/en.json';

@Component({
  styleUrl: 'gux-button-dropdown.less',
  tag: 'gux-button-dropdown',
  shadow: true
})
export class GuxButtonDropdown {
  @Element()
  private root: HTMLElement;
  listboxElement: HTMLGuxListboxElement;
  dropdownButton: HTMLElement;
  actionButton: HTMLElement;
  private i18n: GetI18nValue;

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
   * The component button type
   */
  @Prop()
  type: GuxButtonType = 'button';

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

  /**
   * The component variation (multi or action).
   */
  @Prop()
  variation: string = 'multi';

  @Listen('keydown')
  handleKeydown(event: KeyboardEvent): void {
    const composedPath = event.composedPath();

    switch (event.key) {
      case 'Escape':
        this.expanded = false;
        if (composedPath.includes(this.listboxElement)) {
          this.dropdownButton.focus();
        }
        break;

      case 'ArrowDown':
        if (
          document.activeElement !== this.listboxElement &&
          document.activeElement !== this.actionButton
        ) {
          event.preventDefault();
          this.expanded = true;
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
      if (this.listboxElement) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            this.listboxElement.focus();
          });
        });
      }
      this.open.emit();
    } else {
      this.close.emit();
    }
  }

  @OnClickOutside({ triggerEvents: 'mousedown' })
  onClickOutside(): void {
    this.expanded = false;
  }

  private toggle(): void {
    if (!this.disabled) {
      this.expanded = !this.expanded;
    }
  }

  private onActionClick(): void {
    if (!this.disabled) {
      this.expanded = false;
      this.actionClick.emit();
    }
  }

  private onListboxElementFocusout(): void {
    this.expanded = false;
  }

  async componentWillLoad(): Promise<void> {
    trackComponent(this.root, { variant: this.accent });
    this.listboxElement = this.root.querySelector('gux-listbox');
    this.i18n = await buildI18nForComponent(this.root, defaultResources);
  }

  componentDidLoad(): void {
    if (!this.listboxElement?.getAttribute('aria-label')) {
      this.listboxElement?.setAttribute('aria-label', this.text);
    }
    // this.listboxElement?.addEventListener(
    //   'focusout',
    //   this.onListboxElementFocusout.bind(this)
    // );
  }

  private renderButton(): JSX.Element {
    if (this.variation === 'action') {
      return [
        <gux-button-slot-beta class="gux-action-button" accent={this.accent}>
          <button
            type={this.type}
            disabled={this.disabled}
            ref={el => (this.actionButton = el)}
            onClick={() => this.onActionClick()}
          >
            {this.text}
          </button>
        </gux-button-slot-beta>,

        <gux-button-slot-beta class="gux-dropdown-button" accent={this.accent}>
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
      ] as JSX.Element;
    } else {
      return (
        <gux-button-slot-beta class="gux-dropdown-button" accent={this.accent}>
          <button
            type="button"
            disabled={this.disabled}
            ref={el => (this.dropdownButton = el)}
            onClick={() => this.toggle()}
            aria-haspopup="listbox"
            aria-expanded={this.expanded.toString()}
          >
            <span>{this.text}</span>
            <gux-icon decorative icon-name="chevron-small-down"></gux-icon>
          </button>
        </gux-button-slot-beta>
      ) as JSX.Element;
    }
  }

  render(): JSX.Element {
    return (
      <gux-popup-beta expanded={this.expanded} disabled={this.disabled}>
        <div
          slot="target"
          class={{
            'gux-button-dropdown-container': true,
            'gux-button-dropdown-action': this.variation === 'action',
            'gux-button-dropdown-multi': this.variation !== 'action'
          }}
        >
          {this.renderButton()}
        </div>
        <div slot="popup">
          <slot />
        </div>
      </gux-popup-beta>
    ) as JSX.Element;
  }
}
