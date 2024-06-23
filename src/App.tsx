import * as React from 'react';
import axios from 'axios';

import './App1.scss';
import './App2.css';

import './StyledComponents';

import { FaBeer, FaApple, FaFacebook } from "react-icons/fa";

import {
  StyledContainer,
} from './StyledComponents';

import { List } from './List';

import { Story } from './Data';

import { SearchForm } from './SearchForm';

/*CSS in JS Styled Components*/


/*Data Types*/

/*Component Types*/


/*Reducers*/
type StoriesState = {
  data: Story[],
  isLoading: boolean;
  isError: boolean;
}

type StoriesFetchInit = {
  type: 'STORIES_FETCH_INIT';
}

type StoriesFetchInit1 = {
  type: 'STORIES_FETCH_INIT1';
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

/*
type StoriesAction = {
  type: string;
  payload: any;
};
*/

type StoriesAction = StoriesFetchInit | StoriesFetchSuccessAction | StoriesFetchFailureAction | StoriesRemoveAction | StoriesFetchInit1;

const storiesReducer = (
  state: StoriesState,
  action: StoriesAction
): StoriesState => {
  switch (action.type) {
    case 'STORIES_FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case 'STORIES_FETCH_INIT1':
      return {
        ...state,
        isLoading: false,
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

const getAsyncStories = async (urls: string[]) => {
  const lastUrl = urls == null ? '' : urls[urls.length - 1];
  const result = await axios.get(lastUrl);

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

const useStorageState = (key: string, initialState: string): [string, (newValue: string) => void] =>
//[string, React.Dispatch<React.SetStateAction<string>>]   
{
  const isMounted = React.useRef<boolean>(false);

  const [value, setValue] = React.useState(localStorage.getItem(key) || initialState);

  React.useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
    } else {
      console.log('A');
      localStorage.setItem(key, value);
    }
  }, [value, key]);

  return [value, setValue];
};

/* Components */

const getSumComments = (stories: { data: Story[] }) => {
  console.log('C');
  return stories.data.reduce(
    (result, value) => result + value.num_comments,
    0
  );
};

const extractSearchTerm = (url: string): string => url.replace(API_ENDPOINT, '');

const getLastSearches = (urls: string[]): string[] =>
  urls
    .reduce((result, url, index) => {
      const searchTerm = extractSearchTerm(url);
      if (index === 0) {
        return result.concat(searchTerm);
      }
      const previousSearchTerm = result[result.length - 1];
      if (searchTerm === previousSearchTerm) {
        return result;
      } else {
        return result.concat(searchTerm);
      }
    }, [])
    .slice(-6)
    .slice(0, -1)
    .map(extractSearchTerm);

const getUrl = (searchTerm: string) => `${API_ENDPOINT}${searchTerm}`;

export const App = () => {
  const [searchTerm, setSearchTerm] = useStorageState('searchTerm', 'React');
  const [stories, dispatchStories] = React.useReducer(storiesReducer, { data: [], isLoading: false, isError: false });
  const [urls, setUrls] = React.useState([getUrl(searchTerm)]);

  const handleFetchStories = React.useCallback(async () => {
    dispatchStories({ type: 'STORIES_FETCH_INIT' });
    dispatchStories({ type: 'STORIES_FETCH_INIT1' });
    dispatchStories({ type: 'STORIES_FETCH_INIT' });
    try {
      const result = await getAsyncStories(urls);
      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: result/*.data.stories*/, //D
      });
    }
    catch (error) {
      dispatchStories({ type: 'STORIES_FETCH_FAILURE' });
    }
  }, [urls]);

  React.useEffect(() => {
    console.log('How many times do I log?');
    handleFetchStories();
  }, [handleFetchStories]);

  const handleRemoveStory = React.useCallback((item: Story) => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    });
  }, []);

  /*
  let searchedStories = searchTerm === ''
    ? stories.data
    : stories.data.filter(s => s.title.toLowerCase().includes(searchTerm?.toLowerCase() ?? ""));
  */
  let searchedStories = stories.data;

  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = (searchTerm: string) => {
    const url = getUrl(searchTerm);
    setUrls(urls.concat(url));
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    handleSearch(searchTerm);
    event.preventDefault();
  };

  const handleLastSearch = (searchTerm: string) => {
    handleSearch(searchTerm);
    setSearchTerm(searchTerm);
  };

  const sumComments = React.useMemo(
    () => getSumComments(stories),
    [stories]
  );

  const lastSearches = getLastSearches(urls);

  return (
    // <div className={styles.container}>
    <StyledContainer>
      Icons from react-icons/fa:<span><FaBeer /><FaApple /><FaFacebook /></span>
      {/* <h1 className={styles.headlinePrimary}>My Hacker Stories</h1> */}
      {/* <StyledHeadlinePrimary>My Hacker Stories</StyledHeadlinePrimary> */}
      <h1>My Hacker Stories with {sumComments} comments.</h1>
      <SearchForm onSearchSubmit={handleSearchSubmit} onSearchInput={handleSearchInput} searchTerm={searchTerm} />
      <LastSearches lastSearches={lastSearches} onLastSearch={handleLastSearch}/>
      {/* <hr /> */}
      {stories.isError && <p style={{ color: 'red' }}>Something went wrong ...</p>}
      {
        stories.isLoading
          ? (<strong><h1>Loading...</h1></strong>)
          : (<List list={searchedStories} onRemoveItem={handleRemoveStory} />)
      }
      {/* </div> */}
    </StyledContainer>
  );
};

/*----------Class component examples----------*/

type App1Props = {
  searchTerm: string;
}

type App1State = {
  searchTerm: string;
}

export class App1 extends React.Component<App1Props, App1State> {
  constructor(props: App1Props) {
    super(props);
    this.state = {
      searchTerm: 'React1',
    };
  }
  render() {
    const { searchTerm } = this.state;
    return (
      <div>
        <h1>My Hacker Stories from Class compoent</h1>
        <SearchForm
          searchTerm={searchTerm}
          onSearchInput={(event) => this.setState({ searchTerm: event.target.value })}
        />
      </div>
    );
  }
}

/*----------End class component examples----------*/

type LastSearchesProps = {
  lastSearches: string[],
  onLastSearch: (searchTerm: string) => void
}

const LastSearches: React.FC<LastSearchesProps> = ({ lastSearches, onLastSearch }) => (
  <>
    {lastSearches.map((searchTerm, index) => (
      <button
        key={searchTerm + index}
        type="button"
        onClick={() => onLastSearch(searchTerm)}
      >
        {searchTerm}
      </button>
    ))}
  </>
);


export default App;

export { storiesReducer, StoriesAction };