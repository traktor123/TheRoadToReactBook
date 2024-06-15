import * as React from 'react';
import axios from 'axios';

import styles from './App.module.css';
import './App1.scss';
import './App2.css';
import clsx from 'clsx';

import styled from 'styled-components';

import { ReactComponent as Check } from './assets/check.svg';

import { FaBeer, FaApple, FaFacebook } from "react-icons/fa";

/*CSS in JS Styled Components*/
const StyledContainer = styled.div`
height: 100vw;
padding: 20px;
background: #83a4d4;
background: linear-gradient(to left, #b6fbff, #83a4d4);
color: #171212;
`;

const StyledHeadlinePrimary = styled.h1`
font-size: 48px;
font-weight: 300;
letter-spacing: 2px;
color: blue;
`;

const StyledItem = styled.li`
display: flex;
align-items: center;
padding-bottom: 5px;
`;

type StyledColumnProps = {
  width: string;
}

const StyledColumn = styled.span<StyledColumnProps>`
padding: 0 5px;
white-space: nowrap;
overflow: hidden;
white-space: nowrap;
text-overflow: ellipsis;
a {
color: inherit;
}
width: ${(props) => props.width};
`;

const StyledButton = styled.button`
  background: transparent;
  border: 1px solid #171212;
  padding: 5px;
  cursor: pointer;
  transition: all 0.1s ease-in;

  &:hover {
    background: #171212;
    color: #ffffff;
  }
`;

const StyledButtonSmall = styled(StyledButton)`
  padding: 5px;
`;

const StyledButtonLarge = styled(StyledButton)`
  padding: 10px;
`;

const StyledSearchForm = styled.form`
  padding: 10px 0 20px 0;
  display: flex;
  align-items: baseline;
`;

const StyledLabel = styled.label`
  border-top: 1px solid #171212;
  border-left: 1px solid #171212;
  padding-left: 5px;
  font-size: 24px;
`;

const StyledInput = styled.input`
  border: none;
  border-bottom: 1px solid #171212;
  background-color: transparent;
  font-size: 24px;
`;


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

type StoriesAction = StoriesFetchInit | StoriesFetchSuccessAction | StoriesFetchFailureAction | StoriesRemoveAction | StoriesFetchInit1;

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
  const isMounted = React.useRef(false);

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

export const App = () => {
  const [searchTerm, setSearchTerm] = useStorageState('searchTerm', 'React');
  const [stories, dispatchStories] = React.useReducer(storiesReducer, { data: [], isLoading: false, isError: false });
  const [url, setUrl] = React.useState(`${API_ENDPOINT}${searchTerm}`);

  const handleFetchStories = React.useCallback(async () => {
    dispatchStories({ type: 'STORIES_FETCH_INIT' });
    dispatchStories({ type: 'STORIES_FETCH_INIT1' });
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

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);
    event.preventDefault();
  };

  console.log('B:App');

  //const sumComments = getSumComments(stories);
  const sumComments = React.useMemo(
    () => getSumComments(stories),
    [stories]
  );  

  return (
    // <div className={styles.container}>
    <StyledContainer>
      Icons from react-icons/fa:<span><FaBeer /><FaApple /><FaFacebook /></span>
      {/* <h1 className={styles.headlinePrimary}>My Hacker Stories</h1> */}
      {/* <StyledHeadlinePrimary>My Hacker Stories</StyledHeadlinePrimary> */}
      <h1>My Hacker Stories with {sumComments} comments.</h1>
      <SearchForm onSearchSubmit={handleSearchSubmit} onSearchInput={handleSearchInput} searchTerm={searchTerm} />
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

type SearchFormProps = {
  onSearchSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
  onSearchInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
  searchTerm: string;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearchSubmit: onSearchSubmit, onSearchInput: onSearchInput, searchTerm }) => {
  return (
    <StyledSearchForm onSubmit={onSearchSubmit}>
      <InputWithLabel
        onInputChange={onSearchInput}
        value={searchTerm}
        id="search" isFocused={true}>
        <strong>Search:</strong>
      </InputWithLabel>
      &nbsp;
      {/* <button type="submit" disabled={!searchTerm} className={`${styles.button} ${styles.buttonSmall}`}>Submit</button> */}
      {/* <button type="submit" disabled={!searchTerm} className="smallButton1">Submit</button> */}
      <StyledButtonLarge type="submit" disabled={!searchTerm}>Submit</StyledButtonLarge>
    </StyledSearchForm>)
}

/*
const InputWithLabel: React.FC<InputWithLabelProps> = ({ value, onInputChange, id, type = 'text', children, isFocused = false }) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <div>
      <label htmlFor={id}>{children}</label>
      &nbsp;
      <input
        id={id}
        type={type}
        onChange={onInputChange}
        value={value}
        ref={inputRef} />
      <p>
        Searching for <strong>{value}</strong>
      </p>
    </div>)
}
*/

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

class InputWithLabel extends React.Component<InputWithLabelProps> {

  private inputRef: React.RefObject<HTMLInputElement>;

  constructor(props: InputWithLabelProps) {
    super(props);
    this.inputRef = React.createRef();
  }

  //Class component’s lifecycle method 
  componentDidMount() {
    /*
    if (this.props.isFocused) {
      this.inputRef.current?.focus();
    }
    */
  }

  render() {
    const {
      id,
      value,
      type = 'text',
      onInputChange,
      children,
    } = this.props;
    return (
      <>
        <StyledLabel htmlFor={id}>{children}</StyledLabel>
        &nbsp;
        <StyledInput
          ref={this.inputRef}
          id={id}
          type={type}
          value={value}
          onChange={onInputChange} />
      </>
    );
  }
}

/*----------End class component examples----------*/

const List: React.FC<ListProps> = React.memo(({ list, onRemoveItem }) => {
  console.log('B:List');
  return <ul>
    {
      list.map((item) => (
        <div key={item.objectID}>
          <Item item={item} onRemoveItem={onRemoveItem} />
        </div>
      ))
    }
  </ul>
});

const isSmall: boolean = true;

const Item: React.FC<ItemProps> = ({
  item,
  onRemoveItem }) =>
(
  <StyledItem>
    <StyledColumn width="40%">
      <a href={item.url}>{item.title}</a>
    </StyledColumn>
    &nbsp;
    <StyledColumn width="30%">{item.author}</StyledColumn>
    &nbsp;
    <StyledColumn width="10%">{item.num_comments}</StyledColumn>
    &nbsp;
    <StyledColumn width="10%">{item.points}</StyledColumn>
    &nbsp;
    <StyledColumn width="10%">
      <button className={clsx(styles.button, { [styles.buttonSmall]: isSmall })}
        type="button"
        onClick={onRemoveItem.bind(null, item)}>
        <Check height="18px" width="18px" />
      </button>
    </StyledColumn>
  </StyledItem>
)

export default App;