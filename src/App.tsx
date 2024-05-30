import * as React from 'react';

/*Data Types*/

type Story = {
  title: string,
  url: string,
  author: string,
  num_comments: number,
  points: number,
  objectID: number
}

/*Component Types*/

type ListProps = {
  list: Story[];
  onRemoveItem: (item: Story) => void;
};

type ItemProps = {
  /*
  title: string,
  url: string,
  author: string,
  num_comments: number,
  points: number,
  objectID: number,
  */
  item: Story;
  onRemoveItem: (item: Story) => void;
}

type InputWithLabelProps = {
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  id: string;
  type?: string;
  children?: React.ReactNode;
  isFocused?: boolean;
};

/*Reducers*/
type StoriesState = {
  data: Story[],
  isLoading: boolean;
  isError: boolean;
}

type StoriesFetchInit = {
  type: 'STORIES_FETCH_INIT';
}

type StoriesFetchSuccessAction = {
  type: 'STORIES_FETCH_SUCCESS';
  payload: Story[];
};

type StoriesFetchFailureAction = {
  type: 'STORIES_FETCH_FAILURE';
};

type StoriesRemoveAction = {
  type: 'REMOVE_STORY';
  payload: Story;
};

type StoriesAction = StoriesFetchInit | StoriesFetchSuccessAction | StoriesFetchFailureAction | StoriesRemoveAction;

const storiesReducer = (
  state: StoriesState,
  action: StoriesAction
) => {
  switch (action.type) {
    case 'STORIES_FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case 'STORIES_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case 'STORIES_FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case 'REMOVE_STORY':
      return {
        ...state,
        data: state.data.filter(
          (story) => action.payload.objectID !== story.objectID
        ),
      };
    default:
      throw new Error();
  }
};

// Data
const initialStoriesList: Story[] = [
  {
    title: 'React',
    url: 'https://reactjs.org/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://redux.js.org/',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
  {
    title: 'NgRx',
    url: 'https://redux.js.org/',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 2,
  },
  {
    title: 'C#',
    url: 'https://redux.js.org/',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 3,
  },
];

/* functions */

const getAsyncStories = () => new Promise<{ data: { stories: Story[] } }>((resolve, reject) => {
  setTimeout(() => {
    //throw "Error while loading Stories from remote Repository."; //will not work because within timeout!
    // reject("Error while loading Stories from remote Repository.");
    resolve({ data: { stories: initialStoriesList } })    
  }, 3000);
}
);

const useStorageState = (key: string, initialState: string): [string, (initialState: string) => void] =>
//[string, React.Dispatch<React.SetStateAction<string>>]   
{
  const [value, setValue] = React.useState(localStorage.getItem(key) || initialState);

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};

/* Components */

const App = () => {
  const [searchTerm, setSearchTerm] = useStorageState('searchTerm', 'React');
  const [stories, dispatchStories] = React.useReducer(storiesReducer, { data:[], isLoading: false, isError: false });

  React.useEffect(() => {
    dispatchStories({ type: 'STORIES_FETCH_INIT' });
    getAsyncStories()
      .then(result => {
        dispatchStories({
          type: 'STORIES_FETCH_SUCCESS',
          payload: result.data.stories,
        });
      })
      .catch(error => {
        dispatchStories({ type: 'STORIES_FETCH_FAILURE' })
      });
  }, []);

  const handleRemoveStory = (item: Story) => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    });
  };

  let searchedStories = searchTerm === ''
    ? stories.data
    : stories.data.filter(s => s.title.toLowerCase().includes(searchTerm?.toLowerCase() ?? ""));

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);

    console.log("Log from App Component" + event.target.value);
  };

  return (
    <div>
      <h1>My Hacker Stories</h1>
      <InputWithLabel onInputChange={handleSearch} value={searchTerm} id="search" isFocused={true}>
        <strong>Search:</strong>
      </InputWithLabel>
      <hr />
      {stories.isError && <p style={{ color: 'red' }}>Something went wrong ...</p>}
      {
        stories.isLoading
          ? (<strong><h1>Loading...</h1></strong>)
          : (<List list={searchedStories} onRemoveItem={handleRemoveStory} />)
      }
    </div>
  );
};

const InputWithLabel: React.FC<InputWithLabelProps> = ({ value, onInputChange, id, type = 'text', children, isFocused = false }) => {
  // A
  const inputRef = React.useRef<HTMLInputElement>(null);
  // C
  React.useEffect(() => {
    if (isFocused && inputRef.current) {
      // D
      inputRef.current.focus();
    }
  }, [isFocused]);

  return <>
    <div key="1">
      <label htmlFor={id}>{children}</label>
      &nbsp;
      {/* B */}
      <input
        id={id}
        type={type}
        onChange={onInputChange}
        value={value}
        ref={inputRef} />
      <p>
        Searching for <strong>{value}</strong>
      </p>
    </div>
    <div>
      Search Footer
    </div>
  </>
}

const List: React.FC<ListProps> = ({ list, onRemoveItem }) => {

  return <ul>
    {
      list.map((item) => (
        <div key={item.objectID}>
          <Item item={item} onRemoveItem={onRemoveItem} />
        </div>
      ))
    }
  </ul>
};

const Item: React.FC<ItemProps> = ({
  item,
  onRemoveItem }) =>
(
  <li>
    <span>
      <a href={item.url}>{item.title}</a>
    </span>
    &nbsp;
    <span>{item.author}</span>
    &nbsp;
    <span>{item.num_comments}</span>
    &nbsp;
    <span>{item.points}</span>
    &nbsp;
    <button type="button" onClick={() => onRemoveItem(item)}>Remove</button>
    <button type="button" onClick={onRemoveItem.bind(null, item)}>Remove</button>
  </li>
)

export default App;