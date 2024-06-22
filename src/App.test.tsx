import { describe, it, expect, vi } from 'vitest';

import App, {
    storiesReducer,
    Item,
    SearchForm,
    StoriesAction,
    SearchFormProps
} from './App';

import {
    render,
    screen,
    fireEvent,
    waitFor,
} from '@testing-library/react';

import axios from 'axios';
vi.mock('axios');

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
            //screen.debug();
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

    describe('App', () => {
        it('succeeds fetching data', async () => {
            const promise = Promise.resolve({
                data: {
                    hits: stories,
                },
            });
            (axios.get as jest.Mock).mockImplementationOnce(() => promise);
            render(<App />);
            screen.debug();
            expect(screen.queryByText(/Loading/)).toBeInTheDocument();
            await waitFor(async () => {
                await promise;
                screen.debug();
                expect(screen.queryByText(/Loading/)).toBeNull();
                expect(screen.getByText('React')).toBeInTheDocument();
                expect(screen.getByText('Redux')).toBeInTheDocument();
                //expect(screen.getAllByRole('listitem').length).toBe(2);
                expect(screen.getAllByText('Dismiss').length).toBe(2);
                //console.log(data);
            });
        });
    });

    it('fails fetching data', async () => {
        const promise = Promise.reject();
        (axios.get as jest.Mock).mockImplementationOnce(() => promise);
        render(<App />);
        expect(screen.getByText(/Loading/)).toBeInTheDocument();
        try {
            await waitFor(async () => await promise);
        } catch (error) {
            expect(screen.queryByText(/Loading/)).toBeNull();
            expect(screen.queryByText(/went wrong/)).toBeInTheDocument();
        }
    });

    it('removes a story', async () => {
        const promise = Promise.resolve({
            data: {
                hits: stories,
            },
        });
        (axios.get as jest.Mock).mockImplementationOnce(() => promise);
        render(<App />);
        await waitFor(async () => await promise);
        await promise; //That should not be here
        expect(screen.getAllByText('Dismiss').length).toBe(2);
        expect(screen.getByText('Jordan Walke')).toBeInTheDocument();
        fireEvent.click(screen.getAllByText('Dismiss')[0]);
        expect(screen.getAllByText('Dismiss').length).toBe(1);
        expect(screen.queryByText('Jordan Walke')).toBeNull();
    });

    it('searches for specific stories', async () => {
        const reactPromise = Promise.resolve({
            data: {
                hits: stories,
            },
        });
        const anotherStory = {
            title: 'JavaScript',
            url: 'https://en.wikipedia.org/wiki/JavaScript',
            author: 'Brendan Eich',
            num_comments: 15,
            points: 10,
            objectID: 3,
        };
        const javascriptPromise = Promise.resolve({
            data: {
                hits: [anotherStory],
            },
        });
        (axios.get as jest.Mock).mockImplementation((url: string) => {
            if (url.includes('React')) {
                return reactPromise;
            }
            if (url.includes('JavaScript')) {
                return javascriptPromise;
            }
            throw Error();
        });

        // Initial Render
        render(<App />);

        // First Data Fetching
        await waitFor(async () => await reactPromise);
        await reactPromise; //That should not be here

        expect(screen.queryByDisplayValue('React')).toBeInTheDocument();
        expect(screen.queryByDisplayValue('JavaScript')).toBeNull();
        expect(screen.queryByText('Jordan Walke')).toBeInTheDocument();
        expect(screen.queryByText('Dan Abramov, Andrew Clark')).toBeInTheDocument();

        expect(screen.queryByText('Brendan Eich')).toBeNull();

        // User Interaction -> Search
        fireEvent.change(screen.queryByDisplayValue('React'), {
            target: {
                value: 'JavaScript',
            },
        });
        expect(screen.queryByDisplayValue('React')).toBeNull();
        expect(screen.queryByDisplayValue('JavaScript')).toBeInTheDocument();

        fireEvent.submit(screen.queryByText('Submit'));
        // Second Data Fetching
        await waitFor(async () => await javascriptPromise);
        await javascriptPromise; //That should not be here
        expect(screen.queryByText('Jordan Walke')).toBeNull();
        expect(screen.queryByText('Dan Abramov, Andrew Clark')).toBeNull();
        expect(screen.queryByText('Brendan Eich')).toBeInTheDocument();
    });

    it('renders snapshot', () => {
        const searchFormProps: SearchFormProps = {
            onSearchSubmit: () => {},
            onSearchInput: () => {},
            searchTerm: "React"
        }

        const { container } = render(<SearchForm {...searchFormProps} />);
        expect(container.firstChild).toMatchSnapshot();
    });
});