// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// jsdom does not implement IntersectionObserver, which framer-motion needs
// for whileInView/useInView animations.
class MockIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
window.IntersectionObserver = MockIntersectionObserver;

// jsdom does not implement ResizeObserver either, which
// @react-three/fiber's Canvas (react-use-measure) requires.
class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = MockResizeObserver;

// jsdom's canvas getContext() returns null, which would crash CursorTrail and
// EasterEggs. Return a stub whose every method is a no-op jest.fn().
HTMLCanvasElement.prototype.getContext = function getContext() {
  return new Proxy(
    {},
    {
      get(target, prop) {
        if (!(prop in target)) target[prop] = jest.fn();
        return target[prop];
      },
      set(target, prop, value) {
        target[prop] = value;
        return true;
      },
    }
  );
};

// jsdom has no fetch; Projects fetches the GitHub repo list on mount.
// Plain functions, not jest.fn(): react-scripts sets resetMocks: true, which
// would strip a jest.fn() implementation before each test.
window.fetch = () =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  });

// jsdom logs "Not implemented" errors for scrollTo (used by Navbar/Footer).
window.scrollTo = () => {};
