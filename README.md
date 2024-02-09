# ScrollSizeObserver

ScrollSizeObserver is a lightweight JavaScript library that provides a simple and efficient way to observe changes to elements' [`scrollWidth`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollWidth) and [`scrollHeight`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight) properties. It offers a similar API to [`ResizeObserver`](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver).

## Features

- **Easy Integration**: Simple to integrate into existing projects with minimal setup.
- **Flexible Configuration**: Offers options to observe horizontal and/or vertical scroll sizes based on requirements.
- **Efficient Observations**: Utilizes modern browser APIs to efficiently track changes without impacting performance.
- **Cross-Browser Compatibility**: Compatible with major modern browsers, ensuring consistent behavior across different environments.
- **TypeScript Support**: Provides full support for TypeScript, enabling type-checking and enhanced development experience.
- **Lightweight**: Zero-dependency minimal footprint ensures fast loading times and optimal performance.

## Demo

Check out the [demo page](https://avisek.github.io/scroll-size-observer/) to see a simple demonstration of the ScrollSizeObserver library in action.

## Installation

You can install ScrollSizeObserver via npm:

```sh
npm install scroll-size-observer
```

## Usage

```javascript
import { ScrollSizeObserver } from 'scroll-size-observer'

// Just like `ResizeObserver`
const observer = new ScrollSizeObserver((entries, observer) => {
  entries.forEach((entry) => {
    console.log('Target element:', entry.target)
    console.log('New scrollWidth:', entry.scrollWidth)
    console.log('New scrollHeight:', entry.scrollHeight)
    console.log('Previous scrollWidth:', entry.previousScrollWidth)
    console.log('Previous scrollHeight:', entry.previousScrollHeight)
  })
})

// Observe an element
observer.observe(elementToObserve)

// Observe only `scrollHeight`
observer.observe(elementToObserve, { scrollWidth: false })

// Unobserve an element
observer.unobserve(elementToUnobserve)

// Unobserve all observed elements
observer.disconnect()
```

## API

- **`ScrollSizeObserver(callback: ScrollSizeObserverCallback)`**

  Creates a new `ScrollSizeObserver` instance.

  - `callback`: A function called whenever an observed scroll size change occurs.

- **`observe(target: Element, options?: ScrollSizeObserverOptions): void`**

  Starts observing the specified `Element`.

  - `target`: A reference to the `Element` to be observed.
  - `options`: An options object allowing you to set options for the observation.

- **`unobserve(target: Element): void`**

  Ends the observation of a specified `Element`.

  - `target`: A reference to the `Element` to be unobserved.

- **`disconnect(): void`**

  Unobserves all observed `Element` targets.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Fork the repository, make your changes, and submit a pull request. Thank you for helping improve our project!

## Support

For any questions, issues, or feature requests, please [open an issue](https://github.com/avisek/scroll-size-observer/issues/new).
