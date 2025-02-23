# gux-dropdown-v2 manual accessibility testing status
**Last Updated:** Fri Feb 04 2022 10:21:48 GMT-0500 (Eastern Standard Time)
| Pass | WCAG Success Criterion | Notes |
| --- | --- | --- |
| ✅ | [2.1.1 Keyboard](https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html) | - |
| ✅ | [2.1.2 No Keyboard Trap](https://www.w3.org/WAI/WCAG21/Understanding/no-keyboard-trap.html) | - |
| ✅ | [2.4.3 Focus Order](https://www.w3.org/WAI/WCAG21/Understanding/focus-order.html) | - |
| ✅ | [2.4.7 Focus Visible](https://www.w3.org/WAI/WCAG21/Understanding/focus-visible.html) | - |
| ✅ | [2.5.3 Label in Name](https://www.w3.org/WAI/WCAG21/Understanding/label-in-name.html#dfn-name) | - |
| ✅ | [3.2.1 On Focus](https://www.w3.org/WAI/WCAG21/Understanding/on-focus.html) | - |
| ❌ | [3.2.2 On Input](https://www.w3.org/WAI/WCAG21/Understanding/on-input.html) | Typing in the field filters the dropdown results, but does not notify the screenreader of the change of content. Related to COMUI-811, create an aria live component |
| ❌ | [3.3.1 Error Identification](https://www.w3.org/WAI/WCAG21/Understanding/error-identification.html) | COMUI-795 UX updates, add text 'no results' when results are filtered out |
| ✅ | [3.2.2 Labels or Instructions](https://www.w3.org/WAI/WCAG21/Understanding/labels-or-instructions.html) | - |
| ✅ | [4.1.2: Name, Role, Value](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html) | - |
| ✅ | [4.1.3 Status Messages](https://www.w3.org/WAI/WCAG21/Understanding/status-messages.html) | - |