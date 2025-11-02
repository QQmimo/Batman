import { useEffect, useState } from 'react'
import { Settings } from './pages/settings/settings';
import { Batman } from './pages/batman/batman';
import { Header } from './components/header/header';
import { Search } from './pages/search/search';
import { Facts } from './pages/facts/facts';
import './App.css';

export default function App() {
  const [content, setContent] = useState(null);
  const [autohide, setAutohide] = useState(true);
  const [showTools, setShowTools] = useState(false);
  const [filter, setFilter] = useState({});
  const [start, setStart] = useState(false);
  const [update, setUpdate] = useState(new Date());
  const [hideHeader, setHideHeader] = useState(true);

  useEffect(() => {
    if (location.pathname === "/") {
      setHideHeader(false);
      setAutohide(true);
      setShowTools(false);
      setContent(<Batman isStart={start} update={update} />);
    }
    else if (location.pathname === "/settings") {
      setHideHeader(false);
      setAutohide(false);
      setShowTools(true);
      setContent(<Settings filter={filter} />);
    }
    else if (location.pathname === '/facts') {
      setHideHeader(true);
      setContent(<Facts />);
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
      {
        !hideHeader
          ?
          <Header
            title={"Batman Challenge"}
            showTools={showTools}
            autohide={autohide}
            onSearch={onSearch}
            onFilter={setFilter}
            onStart={onStart}
          />
          :
          null
      }
      {content}
    </>
  )
}