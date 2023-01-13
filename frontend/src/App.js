import './index.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ChatBox from './components/ChatBox';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ChatBox />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
