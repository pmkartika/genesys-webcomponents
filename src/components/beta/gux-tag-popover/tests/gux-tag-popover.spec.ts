import { newSpecPage } from '@stencil/core/testing';
import { GuxTagPopover } from '../gux-tag-popover';

describe('gux-tag-popover', () => {
  it('should render', async () => {
    const page = await newSpecPage({
      components: [GuxTagPopover],
      html: `
        <gux-tag-popover-beta lang="en">
          <gux-option>English</gux-option>
          <gux-option>Dutch</gux-option>
        </gux-tag-popover-beta>
      `,
      language: 'en'
    });

    expect(page.root).toMatchSnapshot();
  });
});
