import {
  Component,
  Element,
  h,
  Prop,
  Event,
  EventEmitter
} from '@stencil/core';
import tagResources from './i18n/en.json';
import { buildI18nForComponent } from '../../../i18n';

@Component({
  styleUrl: 'gux-tag.less',
  tag: 'gux-tag-beta'
})
export class GuxTag {
  @Element()
  root: HTMLElement;

  /**
   * Triggered when click on close button
   */
  @Event()
  deleteTag: EventEmitter;

  /**
   * Tag background color.
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
   * Index for remove tag
   */
  @Prop()
  tagId: string;

  private i18n: (resourceKey: string, context?: any) => string;

  private handlerClickDeleteTag(): void {
    this.deleteTag.emit(this.tagId);
  }

  private getDeleteButton() {
    return (
      <button
        tabindex="0"
        type="button"
        onClick={this.handlerClickDeleteTag.bind(this)}
        class={`gux-tag-delete-button ${this.color || ''}`}
      >
        <gux-icon
          screenreader-text={this.i18n('delete-tag')}
          icon-name="ic-close"
          class="gux-tag-delete-icon"
        />
      </button>
    );
  }

  async componentWillRender() {
    this.i18n = await buildI18nForComponent(this.root, tagResources);
  }

  render() {
    return (
      <div class="gux-tag">
        <div class={`gux-tag-text ${this.color || ''}`} tabindex="0">
          <slot />
        </div>
        {this.getDeleteButton()}
      </div>
    );
  }
}
