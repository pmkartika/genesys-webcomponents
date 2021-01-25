# gux-tag-popover

<!-- Auto Generated Below -->


## Properties

| Property   | Attribute  | Description                                              | Type                                                                                                                                                   | Default     |
| ---------- | ---------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------- |
| `color`    | `color`    | Tags color                                               | `"aqua-green" \| "blue" \| "bubblegum-pink" \| "dark-purple" \| "electric-purple" \| "fuscha" \| "lilac" \| "navy" \| "olive-green" \| "yellow-green"` | `undefined` |
| `position` | `position` | Indicates the position of the tag button (right or left) | `string`                                                                                                                                               | `'left'`    |


## Dependencies

### Depends on

- [gux-button](../../stable/gux-button)
- [gux-icon](../../stable/gux-icon)
- [gux-dropdown](../../stable/gux-dropdown)
- [gux-option](../../stable/gux-dropdown/gux-option)
- [gux-tag-beta](../gux-tag)

### Graph
```mermaid
graph TD;
  gux-tag-popover-beta --> gux-button
  gux-tag-popover-beta --> gux-icon
  gux-tag-popover-beta --> gux-dropdown
  gux-tag-popover-beta --> gux-option
  gux-tag-popover-beta --> gux-tag-beta
  gux-dropdown --> gux-text-field
  gux-dropdown --> gux-icon
  gux-text-field --> gux-icon
  gux-option --> gux-text-highlight
  gux-tag-beta --> gux-icon
  style gux-tag-popover-beta fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
