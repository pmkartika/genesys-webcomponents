import { newSpecPage } from '@stencil/core/testing';
import { GuxActionButton } from '../gux-action-button';
import { GuxActionItem } from '../gux-action-item/gux-action-item';

const components = [GuxActionButton, GuxActionItem];
const html = `
<gux-action-button lang="en" text="Primary" accent="primary">
  <gux-action-item text="test"></gux-action-item>
  <gux-action-item text="test2"></gux-action-item>
  <gux-action-item text="test3"></gux-action-item>
  <gux-list-divider></gux-list-divider>
  <gux-action-item><span>I am a span</span></gux-action-item>
</gux-action-button>
`;
const language = 'en';

describe('gux-action-button', () => {
  it('should build', async () => {
    const page = await newSpecPage({ components, html, language });

    expect(page.rootInstance).toBeInstanceOf(GuxActionButton);
  });

  it('renders', async () => {
    const page = await newSpecPage({ components, html, language });

    expect(page.root).toMatchSnapshot();
  });

  it('should fire guxactionclick event if not disabled', async () => {
    const page = await newSpecPage({ components, html, language });
    const guxactionclickSpy = jest.fn();

    page.win.addEventListener('guxactionclick', guxactionclickSpy);

    const element = document.querySelector('gux-action-button');
    const actionButton: HTMLButtonElement = element.shadowRoot.querySelector(
      '.gux-action-button > button'
    );

    actionButton.click();

    expect(guxactionclickSpy).toHaveBeenCalledTimes(1);
  });

  it('should not fire guxactionclick event if disabled', async () => {
    const disableHtml = `
    <gux-action-button lang="en" text="Primary" accent="primary" disabled>
      <gux-action-item text="test"></gux-action-item>
      <gux-action-item text="test2"></gux-action-item>
      <gux-action-item text="test3"></gux-action-item>
      <gux-list-divider></gux-list-divider>
      <gux-action-item><span>I am a span</span></gux-action-item>
    </gux-action-button>
    `;
    const page = await newSpecPage({ components, html: disableHtml, language });
    const guxactionclickSpy = jest.fn();

    page.win.addEventListener('guxactionclick', guxactionclickSpy);

    const element = document.querySelector('gux-action-button');
    const actionButton: HTMLButtonElement = element.shadowRoot.querySelector(
      '.gux-action-button > button'
    );

    actionButton.click();

    expect(guxactionclickSpy).toHaveBeenCalledTimes(0);
  });

  it('should fire guxopen and guxclose events if not disabled', async () => {
    const page = await newSpecPage({ components, html, language });
    const guxopenSpy = jest.fn();
    const guxcloseSpy = jest.fn();

    page.win.addEventListener('guxopen', guxopenSpy);
    page.win.addEventListener('guxclose', guxcloseSpy);

    const element = document.querySelector('gux-action-button');
    const dropdownButton: HTMLButtonElement = element.shadowRoot.querySelector(
      '.gux-dropdown-button > button'
    );

    dropdownButton.click();
    dropdownButton.click();

    expect(guxopenSpy).toHaveBeenCalledTimes(1);
    expect(guxcloseSpy).toHaveBeenCalledTimes(1);
  });

  it('should not fire guxopen event if disabled', async () => {
    const disableHtml = `
    <gux-action-button lang="en" text="Primary" accent="primary" disabled>
      <gux-action-item text="test"></gux-action-item>
      <gux-action-item text="test2"></gux-action-item>
      <gux-action-item text="test3"></gux-action-item>
      <gux-list-divider></gux-list-divider>
      <gux-action-item><span>I am a span</span></gux-action-item>
    </gux-action-button>
    `;
    const page = await newSpecPage({ components, html: disableHtml, language });
    const guxopenSpy = jest.fn();

    page.win.addEventListener('guxopen', guxopenSpy);

    const element = document.querySelector('gux-action-button');
    const dropdownButton: HTMLButtonElement = element.shadowRoot.querySelector(
      '.gux-dropdown-button > button'
    );

    dropdownButton.click();

    expect(guxopenSpy).toHaveBeenCalledTimes(0);
  });

  it('should fire guxpress event if action-item not disabled', async () => {
    const page = await newSpecPage({ components, html, language });
    const guxpressSpy = jest.fn();

    page.win.addEventListener('guxpress', guxpressSpy);

    const actionItem = document.querySelector('gux-action-item') as HTMLElement;
    actionItem.click();

    expect(guxpressSpy).toHaveBeenCalledTimes(1);
  });

  it('should not fire guxpress event if action-item disabled', async () => {
    const disableHtml = `
    <gux-action-button lang="en" text="Primary" accent="primary">
      <gux-action-item text="test" disabled></gux-action-item>
      <gux-action-item text="test2"></gux-action-item>
      <gux-action-item text="test3"></gux-action-item>
      <gux-list-divider></gux-list-divider>
      <gux-action-item><span>I am a span</span></gux-action-item>
    </gux-action-button>
    `;
    const page = await newSpecPage({ components, html: disableHtml, language });
    const guxpressSpy = jest.fn();

    page.win.addEventListener('guxpress', guxpressSpy);

    const actionItem = document.querySelector('gux-action-item') as HTMLElement;
    actionItem.click();

    expect(guxpressSpy).toHaveBeenCalledTimes(0);
  });
});
