# Public Events

[Back to main guide](readme)

All public custom events emitted by components should be prefixed with `gux`.

## Changes
* gux-button-multi
  * `open` -> `guxopen`
  * `open` -> `guxclose`

* gux-time-picker-beta
  * `changed` -> `guxchanged`

* gux-visualization-beta
  * `chartComponentReady` -> `guxchartcomponentready`
  * `chartClicked` -> `guxchartclicked`

* gux-action-button
  * `open` -> `guxopen`
  * `close` -> `guxclose`
  * `actionClick` -> `guxactionclick`

* gux-action-item
  * `press` -> `guxpress`

* gux-disclosure-button
  * `active` -> `guxactive`

* gux-input-color-option
  * `colorSelect` -> `internalcolorselect`

* gux-tab-advanced-list
  * `newTab` -> `guxnewtab`
  * `sortChanged` -> `guxsortchanged`

* gux-toggle
  * `check` -> `guxcheck`

## Components that were not changed because they are legacy
* gux-command-action
* gux-tabs-legacy
* gux-tab-legacy

* gux-advanced-dropdow
* gux-dropdown-option
* gux-list
* gux-list-item

## Components that were not changed because the event is simulating a native event
* gux-calendar
* gux-datepicker
