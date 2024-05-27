import * as React from 'react';

type Story = {
  title: string,
  url: string,
  author: string,
  num_comments: number,
  points: number,
  objectID: number
}

type Stories = Story[];

type ListProps = {
  list: Stories;
};

type ItemProps = {
  title: string,
  url: string,
  author: string,
  num_comments: number,
  points: number,
  objectID: number
}

type InputWithLabelProps = {
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  id: string;
  type?: string;
  children?: React.ReactNode;
  isFocused?: boolean;  
};

const stories: Story[] = [
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

const useStorageState = (key: string, initialState: string): [string, React.Dispatch<React.SetStateAction<string>>] => {
  const [value, setValue] = React.useState(localStorage.getItem(key) || initialState);

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};

const App = () => {

  const [searchTerm, setSearchTerm] = useStorageState('searchTerm', 'React');

  let filteredStories = searchTerm == ''
    ? stories
    : stories.filter(s => s.title.toLowerCase().includes(searchTerm?.toLowerCase() ?? ""));

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
      <List list={filteredStories} />
    </div>
  )
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
        ref={inputRef}/>
      <p>
        Searching for <strong>{value}</strong>
      </p>
    </div>
    <div>
      Search Footer
    </div>
  </>
}


const List: React.FC<ListProps> = ({ list }) => (
  <ul>
    {
      list.map((item) => (
        <Item key={item.objectID} {...item} />
      ))
    }
  </ul>
);

const Item: React.FC<ItemProps> = ({ title, url, author, num_comments, points }) =>
(
  <li>
    <span>
      <a href={url}>{title}</a>
    </span>
    <span>{author}</span>
    <span>{num_comments}</span>
    <span>{points}</span>
  </li>
)

export default App;