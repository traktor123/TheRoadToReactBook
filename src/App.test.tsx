import { describe, it, expect, vi } from 'vitest';

import App, {
    storiesReducer,
    Item,
    SearchForm,
    StoriesAction
} from './App';

import {
    render,
    screen,
    fireEvent,
    waitFor,
} from '@testing-library/react';

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

describe('Item', () => {
    it('renders all properties', () => {
        render(<Item item={storyOne} />);
        //screen.debug();
        expect(screen.getByText('Jordan Walke')).toBeInTheDocument();
        expect(screen.getByText('React')).toHaveAttribute(
            'href',
            'https://reactjs.org/'
        );
    });

    it('renders a clickable dismiss button', () => {
        render(<Item item={storyOne} />);
        //screen.getByRole('');
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('clicking the dismiss button calls the callback handler', () => {
        const handleRemoveItem = vi.fn();
        render(<Item item={storyOne} onRemoveItem={handleRemoveItem} />);
        fireEvent.click(screen.getByRole('button'));
        expect(handleRemoveItem).toHaveBeenCalledTimes(1);
    });

    describe('SearchForm', () => {
        const searchFormProps = {
            searchTerm: 'React',
            onSearchInput: vi.fn(),
            onSearchSubmit: vi.fn(),
        };
        it('renders the input field with its value', () => {
            render(<SearchForm {...searchFormProps} />);
            screen.debug();
            expect(screen.getByDisplayValue('React')).toBeInTheDocument();
            //expect(screen.getByText('React')).toBeInTheDocument();
            expect(screen.getByLabelText(/Search/)).toBeInTheDocument();
        });
        it('calls onSearchInput on input field change', () => {
            render(<SearchForm {...searchFormProps} />);
            fireEvent.change(screen.getByDisplayValue('React'), {
                target: { value: 'Redux' },
            });
            expect(searchFormProps.onSearchInput).toHaveBeenCalledTimes(1);
        });
        it('calls onSearchSubmit on button submit click', () => {
            render(<SearchForm {...searchFormProps} />);
            fireEvent.submit(screen.getByRole('button'));
            expect(searchFormProps.onSearchSubmit).toHaveBeenCalledTimes(1);
        });
    });
});