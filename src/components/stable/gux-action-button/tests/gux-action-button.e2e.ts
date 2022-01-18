import { E2EPage } from '@stencil/core/testing';

import { newSparkE2EPage, a11yCheck } from '../../../../../tests/e2eTestUtils';

async function clickActionButton(page: E2EPage): Promise<void> {
  return await page.evaluate(() => {
    const element = document.querySelector('gux-action-button');
    const actionButton: HTMLButtonElement = element.shadowRoot.querySelector(
      '.gux-action-button > button'
    );

    actionButton.click();
  });
}

async function clickDropdownButton(page: E2EPage): Promise<void> {
  return await page.evaluate(() => {
    const element = document.querySelector('gux-action-button');
    const dropdownButton: HTMLButtonElement = element.shadowRoot.querySelector(
      '.gux-dropdown-button > button'
    );

    dropdownButton.click();
  });
}

async function clickActionItemButton(page: E2EPage): Promise<void> {
  return await page.evaluate(() => {
    const element = document.querySelector('gux-action-item');
    element.click();
  });
}

describe('gux-action-button', () => {
  const html = `
  <gux-action-button lang="en" text="Primary" accent="primary">
    <gux-action-item text="test"></gux-action-item>
    <gux-action-item text="test2"></gux-action-item>
    <gux-action-item text="test3"></gux-action-item>
    <gux-list-divider></gux-list-divider>
    <gux-action-item><span>I am a span</span></gux-action-item>
  </gux-action-button>
  `;
  it('renders', async () => {
    const page = await newSparkE2EPage({ html });
    const element = await page.find('gux-action-button');

    await a11yCheck(page, [], 'closed');
    await clickDropdownButton(page);
    await a11yCheck(page, [], 'open');

    expect(element).toHaveClass('hydrated');
  });

  it('should fire guxactionclick event if not disabled', async () => {
    const page = await newSparkE2EPage({ html });
    const onGuxActionclick = await page.spyOnEvent('guxactionclick');

    await clickActionButton(page);

    expect(onGuxActionclick).toHaveReceivedEventTimes(1);
  });

  it('should not fire guxactionclick event if disabled', async () => {
    const page = await newSparkE2EPage({ html });
    const onGuxactionclick = await page.spyOnEvent('guxactionclick');
    const element = await page.find('gux-action-button');
    element.setAttribute('disabled', 'disabled');
    await page.waitForChanges();

    await clickActionButton(page);

    expect(onGuxactionclick).toHaveReceivedEventTimes(0);
  });

  it('should fire guxopen and guxclose events if not disabled', async () => {
    const page = await newSparkE2EPage({ html });
    const onGuxopen = await page.spyOnEvent('guxopen');
    const onGuxclose = await page.spyOnEvent('guxclose');

    await clickDropdownButton(page);
    await clickDropdownButton(page);

    expect(onGuxopen).toHaveReceivedEventTimes(1);
    expect(onGuxclose).toHaveReceivedEventTimes(1);
  });

  it('should not fire guxopen event if disabled', async () => {
    const page = await newSparkE2EPage({ html });
    const onGuxopen = await page.spyOnEvent('guxopen');
    const element = await page.find('gux-action-button');
    element.setAttribute('disabled', 'disabled');
    await page.waitForChanges();

    await clickDropdownButton(page);

    expect(onGuxopen).toHaveReceivedEventTimes(0);
  });

  it('should fire guxpress event if action-item not disabled', async () => {
    const page = await newSparkE2EPage({ html });
    const onGuxpress = await page.spyOnEvent('guxpress');

    await clickActionItemButton(page);

    expect(onGuxpress).toHaveReceivedEventTimes(1);
  });

  it('should not fire guxpress event if action-item disabled', async () => {
    const page = await newSparkE2EPage({ html });
    const onGuxpress = await page.spyOnEvent('guxpress');

    const element = await page.find('gux-action-item');
    element.setAttribute('disabled', 'disabled');
    await page.waitForChanges();

    await clickActionItemButton(page);

    expect(onGuxpress).toHaveReceivedEventTimes(0);
  });
});
