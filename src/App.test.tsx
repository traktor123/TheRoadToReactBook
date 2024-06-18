import { describe, it, expect } from 'vitest';

describe('something truthy and falsy', () => {
    it('true to be true', () => {
        expect(true).toBeTruthy();
    });
    it('false to be false', () => {
        expect(false).toBeFalsy();
    });
});

it('true to be true', () => {
    expect(true).toBe(true);
});
it('false to be false', () => {
    expect(false).toBe(false);
});

describe('App component', () => {
  it('removes an item when clicking the Dismiss button', () => {
  });
  it('requests some initial stories from an API', () => {
  });
});
