import { Component, Element, h, Method, State } from '@stencil/core';
import { matchesFuzzy } from '../../../utils/string/search';
import { buildI18nForComponent, GetI18nValue } from '../../../i18n';
import paletteResources from './i18n/en.json';
import { trackComponent } from '../../../usage-tracking';

const filterLimit = 50;
const animationDuration = 300; // this 300ms duration must be kept in sync with the 300ms transition in the CSS and delay in the e2e tests

function sortActions(
  items: HTMLGuxCommandActionElement[]
): HTMLGuxCommandActionElement[] {
  return items.sort(
    (a: HTMLGuxCommandActionElement, b: HTMLGuxCommandActionElement) => {
      if (a.recent && !b.recent) {
        return -1;
      }

      if (!a.recent && b.recent) {
        return 1;
      }

      const aText = a.text.toUpperCase();
      const bText = b.text.toUpperCase();

      if (aText < bText) {
        return -1;
      }

      if (aText > bText) {
        return 1;
      }

      return 0;
    }
  );
}

@Component({
  styleUrl: 'gux-command-palette.less',
  tag: 'gux-command-palette-legacy',
  shadow: false
})
export class GuxCommandPaletteLegacy {
  @Element()
  root: HTMLElement;

  /**
   * The current search value.
   */
  @State()
  filterValue: string = '';

  /**
   * If the command palette is shown.
   */
  @State()
  visible: boolean = false;

  private inputElement: HTMLElement;

  private i18n: GetI18nValue;

  async componentWillLoad() {
    trackComponent(this.root);
    this.i18n = await buildI18nForComponent(this.root, paletteResources);
  }

  render() {
    return (
      <div
        class={`gux-command-palette ${this.visible ? '' : 'gux-hidden'}`}
        role="dialog"
        onKeyDown={e => this.onKeyDown(e)}
        aria-label={this.i18n('title')}
      >
        <label
          htmlFor="gux-command-palette-search"
          class="gux-command-palette-search-label"
        >
          {this.i18n('search')}
        </label>
        <gux-input-search>
          <input
            id="gux-command-palette-search"
            type="search"
            onInput={(event: InputEvent) => {
              this.handleInput(event);
            }}
            value={this.filterValue}
            ref={el => (this.inputElement = el)}
          />
        </gux-input-search>

        {this.visible && this.renderLists()}
      </div>
    );
  }

  renderLists() {
    const allItems = Array.from(this.root.children).slice(0, -1) as any[];
    const recentItems = allItems.filter(item => item.recent);
    const commonItems = allItems.filter(item => item.common);
    let filteredItems = this.filterItems(allItems);
    let commonList: HTMLGuxListElement;

    if (commonItems.length) {
      commonList = this.createList(
        commonItems,
        this.filterValue,
        this.i18n('commonSearch')
      );
    }

    if (this.filterValue && filteredItems.length) {
      const filterExceeded = filteredItems.length > filterLimit;
      if (filterExceeded) {
        filteredItems = filteredItems.slice(0, filterLimit);
      }

      const filterList = [
        <gux-list tabindex="-1" highlight={this.filterValue}>
          {filteredItems}
        </gux-list>
      ];

      if (filterExceeded) {
        filterList.unshift(<div class="gux-limit">{this.i18n('limited')}</div>);
      }

      if (filteredItems.length !== 1 && commonItems.length) {
        return [filterList, commonList];
      }

      return filterList;
    }

    const lists = [];

    if (recentItems.length && !this.filterValue) {
      lists.push(
        this.createList(
          recentItems,
          this.filterValue,
          this.i18n('recentSearch')
        )
      );
    }

    if (commonList) {
      lists.push(commonList);
    }

    if (!lists.length) {
      return (
        <gux-list tabindex="-1">
          {this.transformCommands(sortActions(allItems))}
        </gux-list>
      );
    }

    return lists;
  }

  /**
   * Opens the command palette.
   */
  @Method()
  async open() {
    this.visible = true;

    setTimeout(() => {
      this.inputElement.focus();
    }, animationDuration);
  }

  /**
   * Closes the command palette.
   */
  @Method()
  async close() {
    this.filterValue = '';
    this.visible = false;
  }

  private handleInput(event: InputEvent) {
    this.filterValue = (event.target as HTMLInputElement).value;
  }

  private filterItems(items: HTMLGuxCommandActionElement[]): HTMLElement[] {
    return this.transformCommands(
      sortActions(
        items.filter((item: HTMLGuxCommandActionElement) => {
          return matchesFuzzy(
            this.filterValue,
            `${item.text} + ${item.details}`
          );
        })
      ),
      ''
    );
  }

  private createShortcutItem(
    command: HTMLGuxCommandActionElement
  ): HTMLGuxListItemElement {
    return (
      <gux-list-item
        value={command.text}
        onPress={this.handlePress(command)}
        class={(command.details && 'gux-has-details') || ''}
      >
        <div>
          <gux-text-highlight text={command.text} strategy="fuzzy" />
          <span class="gux-shortcut">{command.shortcut}</span>
        </div>
        {command.details && (
          <gux-text-highlight
            class="gux-details"
            text={command.details}
            strategy="fuzzy"
          />
        )}
      </gux-list-item>
    );
  }

  private createStandardItem(
    command: HTMLGuxCommandActionElement
  ): HTMLGuxListItemElement {
    return (
      <gux-list-item
        value={command.text}
        onPress={this.handlePress(command)}
        class={(command.details && 'gux-has-details') || ''}
      >
        <gux-text-highlight text={command.text} strategy="fuzzy" />
        {command.details && (
          <gux-text-highlight
            class="gux-details"
            text={command.details}
            strategy="fuzzy"
          />
        )}
      </gux-list-item>
    );
  }

  private transformCommands(
    commands: HTMLGuxCommandActionElement[],
    header?: string
  ): HTMLElement[] {
    const retVal = [];

    if (header) {
      retVal.push(<strong>{header}</strong>);
    }

    commands.forEach((command: HTMLGuxCommandActionElement) => {
      if (command.shortcut) {
        retVal.push(this.createShortcutItem(command));
        return;
      }

      retVal.push(this.createStandardItem(command));
    });

    return retVal;
  }

  private handlePress(command: HTMLGuxCommandActionElement): () => void {
    return () => {
      this.close();
      setTimeout(() => {
        command.invokePress();
      });
    };
  }

  private createList(
    items: HTMLGuxCommandActionElement[],
    filter: string,
    header?: string
  ): HTMLGuxListElement {
    return (
      <gux-list
        class="gux-command-palette-list"
        highlight={filter}
        tabindex="-1"
      >
        {this.transformCommands(sortActions(items), header)}
      </gux-list>
    );
  }

  private onKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        this.navigateUp();
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.navigateDown();
        break;
    }
  }

  private elementIsSearch(el: Element): boolean {
    return el.closest('gux-input-search') !== null;
  }

  private getParentGuxList(el: Element): HTMLGuxListElement {
    return el.closest('gux-list');
  }

  private setFocusOnElement(el: Element): void {
    const listElement = el as HTMLGuxListElement;
    if (listElement && listElement.setFocusOnLastItem) {
      listElement.setFocusOnLastItem();
      return;
    }

    this.inputElement.focus();
  }

  private navigateUp() {
    const focusedElement = this.root.querySelector(':focus');

    if (this.elementIsSearch(focusedElement)) {
      // Already at the top, don't need to focus elsewhere
      return;
    }

    const guxList = this.getParentGuxList(focusedElement);
    if (!guxList) {
      return;
    }

    guxList.isFirstItemSelected().then(firstSelected => {
      if (!firstSelected) {
        // Let the GUX List handle navigation through the list
        return;
      }

      // Manually jump to the previous element
      this.setFocusOnElement(guxList.previousElementSibling);
    });
  }

  private navigateDown() {
    const focusedElement = this.root.querySelector(':focus');

    if (this.elementIsSearch(focusedElement)) {
      this.root.querySelector('gux-list').setFocusOnFirstItem();
      return;
    }

    const guxList = this.getParentGuxList(focusedElement);
    if (!guxList) {
      return;
    }

    guxList.isLastItemSelected().then(lastSelected => {
      if (!lastSelected) {
        // Let the GUX List handle navigation through the list
        return;
      }

      // Manually jump to the next element
      this.setFocusOnElement(guxList.nextElementSibling);
    });
  }
}
