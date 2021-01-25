import { newE2EPage } from '@stencil/core/testing';

describe('gux-tag-popover-beta', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<gux-tag-popover-beta></gux-tag-popover-beta>');
    const element = await page.find('gux-tag-popover-beta');
    expect(element).toHaveClass('hydrated');
  });

  it('opens menu on click', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <gux-tag-popover-beta>
        <gux-option>English</gux-option>
        <gux-option>Dutch</gux-option>
      </gux-tag-popover-beta>
    `);
    await page.waitForChanges();

    const element = await page.find('gux-tag-popover-beta');
    const btnElm = await element.find('.gux-tag-popover-button');
    btnElm.click();
    await page.waitForChanges();

    const menuElm = await element.find('.gux-tag-popover-menu');
    expect(menuElm.className.split(' ')).toContain('opened');
  });

  it('opens options on click', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <gux-tag-popover-beta>
        <gux-option>English</gux-option>
        <gux-option>Dutch</gux-option>
      </gux-tag-popover-beta>
    `);
    await page.waitForChanges();

    const element = await page.find('gux-tag-popover-beta');
    const btnElm = await element.find('.gux-tag-popover-button');
    btnElm.click();
    await page.waitForChanges();

    const inputElm = await element.find('.gux-dropdown');
    inputElm.click();
    await page.waitForChanges();

    const optionsElm = await element.find('.gux-options');
    expect(optionsElm.className.split(' ')).toContain('opened');
  });

  it('selects an item when an option is clicked', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <gux-tag-popover-beta>
        <gux-option>English</gux-option>
        <gux-option>Dutch</gux-option>
      </gux-tag-popover-beta>
    `);
    await page.waitForChanges();

    const element = await page.find('gux-tag-popover-beta');
    const btnElm = await element.find('.gux-tag-popover-button');
    btnElm.click();
    await page.waitForChanges();

    const inputElm = await element.find('.gux-dropdown');
    inputElm.click();
    await page.waitForChanges();

    const optionElm = await element.find('gux-option');
    optionElm.click();
    await page.waitForChanges();

    const optionsElm = await element.find('.gux-options');
    expect(optionsElm.className.split(' ')).not.toContain('opened');

    const tagElm = await element.find('gux-tag-beta');
    expect(tagElm).not.toBeNull();
  });
});
