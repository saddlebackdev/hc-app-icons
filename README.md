# Healthy Chruch App Icons

SVG Icon Set being used across Healthy Church Apps.

### Current Icon Set
[Icon Preview](https://htmlpreview.github.io/?https://github.com/saddlebackdev/hc-app-icons/blob/dev/src/Icons.html)

### Installation

Using a package manager:

```sh
npm install hc-app-icons
```

### Usage

#### With React

On the web, these icons can be used without an additional setup.

```jsx
import { IconActivity } from "hc-app-icons";

<img src={IconActivity} />
```

#### With React Native

Install `React Native SVG` and follow the [documentation](https://github.com/react-native-svg/react-native-svg#readme).

### Adding icons

- **Single-color icons** go in `src/v2/icons`. The build strips their fills so apps can tint them. Draw them in `#333`; the web components replace `#333` with `currentColor`.
- **Multi-color icons** go in `src/v2/color-icons` and end in `-color.svg` (for example `prayer-color.svg`). The build keeps their fills and colors exactly as authored, including `white`.

Both folders build into the same output, so an icon name can only exist in one of them.

### Multi-color icons

Multi-color icons render in their designed colors with no extra setup:

```jsx
import { IconPrayerColor } from "hc-app-icons";

<img src={IconPrayerColor} />
```

Don't apply a tint or `fill` to them; a single color would flatten every part of the icon into one shape.

To change a specific color in React Native, map that exact value to a prop in your `.svgrrc`:

```json
{
  "replaceAttrValues": {
    "#F99B2F": "{props.accentColor}"
  }
}
```

Colors on multi-color icons are kept exactly as written (for example `white` stays `white`, not `#fff`), so a `#fff` remap meant for single-color icons does not repaint their white details.
