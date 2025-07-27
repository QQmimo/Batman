import { useEffect, useState } from 'react'
import { Settings } from './pages/settings/settings';
import { Batman } from './pages/batman/batman';
import { Header } from './components/header/header';
import { Search } from './pages/search/search';
import './App.css';

export default function App() {
  const [content, setContent] = useState(null);
  const [autohide, setAutohide] = useState(true);
  const [showTools, setShowTools] = useState(false);
  const [filter, setFilter] = useState({});
  const [start, setStart] = useState(false);
  const [update, setUpdate] = useState(new Date());

  useEffect(() => {
    if (location.pathname === "/") {
      setAutohide(true);
      setShowTools(false);
      setContent(<Batman isStart={start} update={update} />);
    }
    else if (location.pathname === "/settings") {
      setAutohide(false);
      setShowTools(true);
      setContent(<Settings filter={filter} />);
    }
  }, [location.pathname, filter, start, update]);

  const onSearch = (text) => {
    setAutohide(false);
    setContent(<Search search={text} />);
  }

  const onStart = () => {
    setStart(true);
    setUpdate(new Date());
  }

  return (
    <>
      <Header title={"Batman Challenge"} showTools={showTools} onSearch={onSearch} onFilter={setFilter} autohide={autohide} onStart={onStart} />
      {content}
    </>
  )
}