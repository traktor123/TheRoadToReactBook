import * as React from 'react';
import axios from 'axios';

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
  onInputChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyUp?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  value?: string;
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
const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

/* functions */

const getAsyncStories = async (url: string = '') => {
  console.log(url);
  let result = await axios.get(url)
  return result.data.hits;
    
  /*
  return fetch(url) // B
    .then((response) => response.json())
    .then(data => data.hits.map((hit: any) => ({
      title: hit.title,
      url: hit.url,
      author: hit.author,
      num_comments: hit.num_comments,
      points: hit.points,
      objectID: hit.objectID,
    })))
  */

  /*
  return new Promise<{ data: { stories: Story[] } }>((resolve, reject) => {
    setTimeout(() => {
      //throw "Error while loading Stories from remote Repository."; //will not work because within timeout!
      // reject("Error while loading Stories from remote Repository.");
      resolve({ data: { stories: initialStoriesList } })
    }, 3000);
  });
  */
}

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
  const [stories, dispatchStories] = React.useReducer(storiesReducer, { data: [], isLoading: false, isError: false });
  const [url, setUrl] = React.useState(`${API_ENDPOINT}${searchTerm}`);

  const handleFetchStories = React.useCallback(async () => {
    dispatchStories({ type: 'STORIES_FETCH_INIT' });

    try {
      const result = await getAsyncStories(url);
      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: result/*.data.stories*/, //D
      });
    }
    catch (error) {
      dispatchStories({ type: 'STORIES_FETCH_FAILURE' });
    }
  }, [url]);

  React.useEffect(() => { handleFetchStories(); } , [handleFetchStories]);

  const handleRemoveStory = (item: Story) => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    });
  };

  /*
  let searchedStories = searchTerm === ''
    ? stories.data
    : stories.data.filter(s => s.title.toLowerCase().includes(searchTerm?.toLowerCase() ?? ""));
  */
  let searchedStories = stories.data;

  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = () => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setUrl(`${API_ENDPOINT}${searchTerm}`);
    }
  };

  return (
    <div>
      <h1>My Hacker Stories</h1>
      <InputWithLabel
        onInputChange={handleSearchInput}
        onKeyUp={handleKeyUp}
        value={searchTerm}
        id="search" isFocused={true}>
        <strong>Search:</strong>
      </InputWithLabel>
      <button
        type="button"
        disabled={!searchTerm}
        onClick={handleSearchSubmit}>
        Submit
      </button>
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

const InputWithLabel: React.FC<InputWithLabelProps> = ({ value, onInputChange, onKeyUp, id, type = 'text', children, isFocused = false }) => {
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
        onKeyUp={onKeyUp}
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
    <button type="button" onClick={onRemoveItem.bind(null, item)}>Remove</button>
  </li>
)

export default App;