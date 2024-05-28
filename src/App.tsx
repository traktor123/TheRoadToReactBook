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

const getAsyncStories = () => Promise.resolve({ data: { stories: stories } });

const useStorageState = (key: string, initialState: string): [string, React.Dispatch<React.SetStateAction<string>>] => {
  const [value, setValue] = React.useState(localStorage.getItem(key) || initialState);

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};

const App = () => {
  
  const [searchTerm, setSearchTerm] = useStorageState('searchTerm', 'React');

  let [filteredStories, setfilteredStories] = React.useState(stories);

  const handleRemoveStory = (item: Story) => {
    const newStories = filteredStories.filter((story) => item.objectID !== story.objectID);
    setfilteredStories(newStories);
  };

  let filteredStories1 = searchTerm == ''
    ? filteredStories
    : filteredStories.filter(s => s.title.toLowerCase().includes(searchTerm?.toLowerCase() ?? ""));

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
      <List list={filteredStories1} onRemoveItem={handleRemoveStory} />
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
    <button type="button" onClick={ () => onRemoveItem(item) }>Remove</button>
    <button type="button" onClick={ onRemoveItem.bind(null, item) }></button>
  </li>
)

export default App;