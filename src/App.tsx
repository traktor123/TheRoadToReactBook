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
  item: Story;
}

const App = () => {

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
  ];

  return (
  <div>
    <h1>My Hacker Stories</h1>
    <Search />
    <hr />
    <List  list={stories}/>
    <hr />
    <List  list={stories}/>
  </div>
)};

const Search = () => {

  const handleChange:React.EventHandler<React.ChangeEvent> = (event: React.ChangeEvent<HTMLInputElement>) => {
    // synthetic event
    console.log(event);
    // value of target (here: input HTML element)
    console.log(event.target.value);
  };

  return (
    <div>
      <label htmlFor="search">Search: </label>
      <input id="search" type="text" onChange={handleChange}/>
    </div>
  )
}

const List: React.FC<ListProps> = (props) => (
  <ul>
    {
      props.list.map((item: Story) => (
      <Item key={item.objectID} item={item}/>
      ))
    }
  </ul>
);

const Item: React.FC<ItemProps> = (props) => 
  (
    <li key={props.item.objectID}>
      <span>
        <a href={props.item.url}>{props.item.title}</a>
      </span>
      <span>{props.item.author}</span>
      <span>{props.item.num_comments}</span>
      <span>{props.item.points}</span>
    </li>
  )

export default App;