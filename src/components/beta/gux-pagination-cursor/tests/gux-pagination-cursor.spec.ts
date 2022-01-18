import { newSpecPage } from '@stencil/core/testing';
import { GuxPaginationCursor } from '../gux-pagination-cursor';

const components = [GuxPaginationCursor];
const language = 'en';

describe('gux-pagination-cursor-beta', () => {
  describe('#render', () => {
    [
      '<gux-pagination-cursor-beta></gux-pagination-cursor-beta>',
      '<gux-pagination-cursor-beta has-next></gux-pagination-cursor-beta>',
      '<gux-pagination-cursor-beta has-previous has-next></gux-pagination-cursor-beta>',
      '<gux-pagination-cursor-beta has-previous></gux-pagination-cursor-beta>'
    ].forEach((html, index) => {
      it(`should render as expected (${index + 1})`, async () => {
        const page = await newSpecPage({ components, html, language });

        expect(page.rootInstance).toBeInstanceOf(GuxPaginationCursor);
        expect(page.root).toMatchSnapshot();
      });
    });
  });

  describe('guxpaginationcursorchange', () => {
    it('should fire guxpaginationcursorchange(previous) event when enabled previous button is clicked', async () => {
      const html =
        '<gux-pagination-cursor-beta has-previous></gux-pagination-cursor-beta>';
      const page = await newSpecPage({ components, html, language });
      const element = page.root as HTMLElement;
      const [previousButton] = Array.from(
        element.shadowRoot.querySelectorAll('button')
      ) as HTMLElement[];
      const guxPaginationCursorchangeSpy = jest.fn();

      page.win.addEventListener(
        'guxpaginationcursorchange',
        guxPaginationCursorchangeSpy
      );

      previousButton.click();
      await page.waitForChanges();

      expect(guxPaginationCursorchangeSpy).toHaveBeenCalledWith(
        expect.objectContaining({ detail: 'previous' })
      );
    });

    it('should fire guxpaginationcursorchange(next) event when enabled next button is clicked', async () => {
      const html =
        '<gux-pagination-cursor-beta has-next></gux-pagination-cursor-beta>';
      const page = await newSpecPage({ components, html, language });
      const element = page.root as HTMLElement;
      const [, nextButton] = Array.from(
        element.shadowRoot.querySelectorAll('button')
      ) as HTMLElement[];
      const guxPaginationCursorchangeSpy = jest.fn();

      page.win.addEventListener(
        'guxpaginationcursorchange',
        guxPaginationCursorchangeSpy
      );

      nextButton.click();
      await page.waitForChanges();

      expect(guxPaginationCursorchangeSpy).toHaveBeenCalledWith(
        expect.objectContaining({ detail: 'next' })
      );
    });

    it('should not fire guxpaginationcursorchange(previous) event when disabled previous button is clicked', async () => {
      const html = '<gux-pagination-cursor-beta></gux-pagination-cursor-beta>';
      const page = await newSpecPage({ components, html, language });
      const element = page.root as HTMLElement;
      const [previousButton] = Array.from(
        element.shadowRoot.querySelectorAll('button')
      ) as HTMLElement[];
      const guxPaginationCursorchangeSpy = jest.fn();

      page.win.addEventListener(
        'guxpaginationcursorchange',
        guxPaginationCursorchangeSpy
      );

      previousButton.click();
      await page.waitForChanges();

      expect(guxPaginationCursorchangeSpy).not.toHaveBeenCalled();
    });

    it('should not fire guxpaginationcursorchange(next) event when disabled next button is clicked', async () => {
      const html = '<gux-pagination-cursor-beta></gux-pagination-cursor-beta>';
      const page = await newSpecPage({ components, html, language });
      const element = page.root as HTMLElement;
      const [, nextButton] = Array.from(
        element.shadowRoot.querySelectorAll('button')
      ) as HTMLElement[];
      const guxPaginationCursorchangeSpy = jest.fn();

      page.win.addEventListener(
        'guxpaginationcursorchange',
        guxPaginationCursorchangeSpy
      );

      nextButton.click();
      await page.waitForChanges();

      expect(guxPaginationCursorchangeSpy).not.toHaveBeenCalled();
    });
  });
});
