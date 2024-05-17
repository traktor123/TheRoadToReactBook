import * as React from 'react';

function getTitle(title: any) {
  return title;
}

function App() {
  return (
    <div>
      {/* <h1>Hello {getTitle("React5")}</h1> */}
      <h1>Hello World</h1>
      <label htmlFor="search">Search: </label>
      <input id="search" type="text" />
    </div>
  );
}
export default App;