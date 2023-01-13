import React, { useEffect, useRef, useState } from 'react';
import socketIOClient from 'socket.io-client';
import './ChatBox.css';
import Picker from 'emoji-picker-react';
import { BsFillEmojiLaughingFill } from 'react-icons/bs';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { AiOutlineLike } from 'react-icons/ai';

const ENDPOINT =
  window.location.host.indexOf('localhost') >= 0
    ? 'http://127.0.0.1:4000'
    : window.location.host;

export default function ChatBox() {
  const uiMessagesRef = useRef(null);
  const [message, setMessage] = useState('');
  const [userName, setUsername] = useState('');
  const [emojiSelector, setEmojiSelector] = useState(false);
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([
    { from: 'System', message: 'Welcome, You can chat now.' },
  ]);
  const user_list = ['Alan', 'Bob', 'Carol', 'Dean', 'Elin'];
  setUsername(user_list[Math.floor(Math.random() * 5)]);
  useEffect(() => {
    if (uiMessagesRef.current) {
      uiMessagesRef.current.scrollBy({
        top: uiMessagesRef.current.scrollHeight,
        left: 0,
        behavior: 'smooth',
      });
    }
    if (!socket) {
      const sk = socketIOClient(ENDPOINT);
      setSocket(sk);
    } else {
      socket.emit('onLogin', { name: userName });
      socket.on('message', (data) => {
        setMessages(data);
      });
    }
  }, [messages, socket, userName]);

  const onEmojiClick = (e) => {
    var str = (message + e.emoji).trim();
    setMessage(str);
    setEmojiSelector(false);
  };
  const sendHandler = () => {
    try {
      socket.emit('sendMessage', { from: userName, message });
      setMessage('');
    } catch (error) {
      alert(error.message);
    }
  };
  return (
    <div className="chatboxContainer">
      <div className="messageBox" ref={uiMessagesRef}>
        {messages.map((item, i) => (
          <>
            <div key={i} className="message">
              <p>from:</p>
              <span>{item.from}</span>
              <p>message:</p>
              <h3>{item.message}</h3>
            </div>
            <i className="icon-box">
              <AiOutlineLike className="icon" />
            </i>
          </>
        ))}
      </div>
      <div className="picker">
        {' '}
        {emojiSelector && (
          <Picker pickerStyle={{ width: '100%' }} onEmojiClick={onEmojiClick} />
        )}
      </div>
      <div className="textBox">
        <div className="inputMessage">
          <div className="input">
            <input
              type="text"
              placeholder="Enter a message.."
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
            />
            <i
              className="icon-box"
              onClick={() => {
                setEmojiSelector(!emojiSelector);
              }}
            >
              {emojiSelector ? (
                <AiOutlineCloseCircle className="icon" />
              ) : (
                <BsFillEmojiLaughingFill className="icon" />
              )}
            </i>
          </div>

          <button onClick={sendHandler}>send</button>
        </div>
      </div>
    </div>
  );
}
