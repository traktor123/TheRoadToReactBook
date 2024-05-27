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

type SearchProps = {
  onSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
  searchTerm: string;
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

const useStorageState = (key:string, initialState: string): [string, React.Dispatch<React.SetStateAction<string>>] => {
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
      <Search onSearch={handleSearch} searchTerm={searchTerm} />
      <hr />
      <List list={filteredStories} />
    </div>
  )
};

const Search: React.FC<SearchProps> = ({ searchTerm, onSearch }) => {
  const handleChange: React.EventHandler<React.ChangeEvent> = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(event);

    // synthetic event
    console.log(event);
    // value of target (here: input HTML element)
    console.log(event.target.value);
  };

  return [
    <div key="1">
      <label htmlFor="search">Search: </label>
      <input id="search" type="text" onChange={handleChange} value={searchTerm} />
      <p>
        Searching for <strong>{searchTerm}</strong>
      </p>
    </div>,
    <div key="2">
      Search Footer      
    </div>
  ]
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