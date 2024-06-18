import { describe, it, expect } from 'vitest';

import App, {
    storiesReducer,
    Item,
    List,
    SearchForm,
    InputWithLabel,
    StoriesAction
} from './App';

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

const storyOne = {
    title: 'React',
    url: 'https://reactjs.org/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
};
const storyTwo = {
    title: 'Redux',
    url: 'https://redux.js.org/',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
};
const stories = [storyOne, storyTwo];

describe('storiesReducer', () => {
    it('removes a story from all stories', () => {
        let action: StoriesAction = { type: "REMOVE_STORY", payload: storyTwo };
        let state = { data: stories, isLoading: false, isError: false }

        let newState = storiesReducer(state, action);
        
        let expectedSttate = {
            data: [storyOne],
            isLoading: false,
            isError: false
        };

        expect(newState).toStrictEqual(expectedSttate);
    });
});

