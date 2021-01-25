import { Component, Element, h, Listen, Prop, State } from '@stencil/core';
import { buildI18nForComponent } from '../../../i18n';
import tagPopoverResources from './i18n/en.json';
import { GuxTag } from '../gux-tag/gux-tag';

@Component({
  styleUrl: 'gux-tag-popover.less',
  tag: 'gux-tag-popover-beta'
})
export class GuxTagPopover {
  @Element()
  root: HTMLElement;
  i18n: (resourceKey: string, context?: any) => string;

  /**
   * Tags color
   */
  @Prop()
  color:
    | 'navy'
    | 'blue'
    | 'electric-purple'
    | 'aqua-green'
    | 'fuscha'
    | 'dark-purple'
    | 'bubblegum-pink'
    | 'olive-green'
    | 'lilac'
    | 'yellow-green';

  /**
   * Indicates the position of the tag button (right or left)
   */
  @Prop()
  position: string = 'left';

  @State()
  opened: boolean;

  @State()
  allOptions: HTMLGuxOptionElement[] = [];

  @State()
  availableOptions: HTMLGuxOptionElement[] = [];

  @State()
  tags: string[] = [];

  @State()
  inputValue: string = '';

  @Listen('deleteTag')
  onDeleteTag(event): void {
    const tags = this.tags;
    tags.splice(event.detail, 1);
    this.filterOptions();
    this.tags = [...tags];
  }

  @Listen('change') // This is not a native "change" event
  handleChange(event) {
    event.stopPropagation();
    this.tags = [...this.tags, event.target.value];
    this.filterOptions();
    event.target.value = this.inputValue = ' ';
    setTimeout(() => {
      event.target.value = this.inputValue = '';
      const dropdownInput = this.root.querySelector(
        'gux-dropdown input'
      ) as HTMLElement;
      dropdownInput.focus();
    });
  }

  async componentWillLoad() {
    this.i18n = await buildI18nForComponent(this.root, tagPopoverResources);
    this.allOptions = Array.from(this.root.querySelectorAll('gux-option'));
    this.availableOptions = [...this.allOptions];
  }

  render() {
    return (
      <div class={`gux-tag-popover ${this.position}`}>
        <div class="gux-tag-popover-container">
          <gux-button
            class={`gux-tag-popover-button ${
              this.tags.length ? 'has-tags' : ''
            }`}
            onClick={() => this.handlerClickOnMenuButton()}
          >
            <gux-icon decorative iconName="ic-tag"></gux-icon>
          </gux-button>
        </div>
        <div class={`gux-tag-popover-menu ${this.opened ? 'opened' : ''}`}>
          <div class="arrow" />
          <div class="gux-tag-popover-menu-container">
            <div class="gux-tag-popover-options-container">
              <b class="gux-tag-popover-title">{this.i18n('menuTitle')}</b>
              <div class="gux-tag-popover-chip-container">
                {this.getTags()}
                {this.getDropdown()}
                <span style={{ display: 'none' }}>
                  <slot />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  private getDropdown(): HTMLElement {
    return (
      <div class="gux-tag-popover-input-container">
        <gux-dropdown
          value={this.inputValue}
          onKeyDown={e => this.addCustomTag(e)}
          filterable
        >
          {this.availableOptions.map(option => {
            return <gux-option text={option.text}>{option.text}</gux-option>;
          })}
        </gux-dropdown>
      </div>
    );
  }

  private getTags(): GuxTag[] {
    const tags = [];
    this.tags.map((tag, index) => {
      const tagChip = (
        <gux-tag-beta color={this.color} tagId={index.toString()}>
          {tag}
        </gux-tag-beta>
      );
      tags.push(tagChip);
    });
    return tags;
  }

  private addCustomTag(event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value;

    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      if (this.tags.indexOf(value) !== -1) {
        return;
      }
      if (value && value.trim().length) {
        this.tags = [...this.tags, value];
      }
      event.target.value = this.inputValue = ' ';
      setTimeout(() => {
        event.target.value = this.inputValue = '';
      });
    }
  }

  private filterOptions(): void {
    this.availableOptions = this.allOptions.filter(
      option => !this.tags.includes(option.text)
    );
  }

  private handlerClickOnMenuButton(): void {
    this.opened = !this.opened;
  }
}
