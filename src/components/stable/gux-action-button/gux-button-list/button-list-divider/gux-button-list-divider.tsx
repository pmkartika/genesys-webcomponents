import { Component, h, JSX } from '@stencil/core';

@Component({
  styleUrl: 'gux-button-list-divider.less',
  tag: 'gux-button-list-divider',
  shadow: true
})
export class GuxListDivider {
  render(): JSX.Element {
    return (
      <span
        role="presentation"
        class="gux-button-list-item gux-divider"
        tabindex={-1}
      />
    ) as JSX.Element;
  }
}
