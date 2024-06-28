import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import ScrollToBottom from 'react-scroll-to-bottom';
import styles from './test.module.css'; // Importing the CSS module

const Testing = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [chatRequests, setChatRequests] = useState([]);
  const [requestname, setRequestname] = useState('');
  const [activeChat, setActiveChat] = useState(null);
  const [username, setUsername] = useState([])
  const [offlineusers, setOfflineusers] = useState([]);
  const [friends, setFriends] = useState([])


  useEffect(() => {
    const newSocket = io('http://localhost:3000', { withCredentials: true });
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to server');
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    newSocket.on('message', (message) => {
      setMessages(prevMessages => [...prevMessages, message]);
    });

    newSocket.on('receive_chat_request', (request) => {
      console.log('Received chat request:', request);
      setChatRequests(prevRequests => [...prevRequests, request]);
    });

    newSocket.on("user detail", (data) => {

      setUsername(data)
    });

    newSocket.on("friends", (data) => {
      console.log(`friends: ${data}`);
      setFriends(data)
    });


    newSocket.on('chat_request_status_updated', (request) => {
      console.log(`Your request to ${request.to} is ${request.status}`);
      setChatRequests(prevRequests =>
        prevRequests.map(req =>
          req._id === request._id ? request : req
        )
      );
    });


    newSocket.on('connected_users', (users) => {
      console.log('Connected users:', users);
      setConnectedUsers(users);
    });






    return () => {
      newSocket.disconnect();
    };
  }, []);


  useEffect(() => {
    setOfflineusers(friends.filter(user => !username.includes(user)));
  }, [username, friends]);


  console.log("offline users are" + offlineusers)


  const sendMessage = (toUserId) => {
    if (socket) {
      const messageData = {
        to: toUserId,
        from: username,
        message: inputMessage,
        time:
          new Date(Date.now()).getHours() +
          ':' +
          new Date(Date.now()).getMinutes(),
      };

      socket.emit('message', messageData);
      setMessages((list) => [...list, messageData]);
      setInputMessage('');
    }
  };

  const sendChatRequest = (toUserId) => {
    if (socket) {
      socket.emit('send_chat_request', { to: toUserId });
    }
  };

  const acceptChatRequest = (requestId) => {
    if (socket) {
      socket.emit('accept_chat_request', { requestId });
    }
  };

  const declineChatRequest = (requestId) => {
    if (socket) {
      socket.emit('decline_chat_request', { requestId });
    }
  };

  return (
    <div className={styles.chatWindow}>
      <div className={styles.chatHeader}>
        <p>Live Chat</p>
      </div>
      <div className={styles.chatBody}>
        <ScrollToBottom className={styles.messageContainer}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={styles.message}
              id={username === msg.from ? styles.you : styles.other}
            >
              <div>
                <div className={styles.messageContent}>
                  <p>{msg.message}</p>
                </div>
                <div className={styles.messageMeta}>
                  <p id="time">{msg.time}</p>
                  <p id="author">{msg.from}</p>
                </div>
              </div>
            </div>
          ))}
        </ScrollToBottom>
      </div>
      <div className={styles.chatFooter}>
        <input
          type="text"
          value={inputMessage}
          placeholder="Hey..."
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => {
            e.key === 'Enter' && activeChat && sendMessage(activeChat.from);
          }}
        />
        <button
          onClick={() => {

            sendMessage(activeChat.from);

          }}
        >
          &#9658;
        </button>
      </div>
      <div>
        <h2>Send Requests</h2>
        <input
          type="text"
          value={requestname}
          onChange={(e) => setRequestname(e.target.value)}
        />
        <button onClick={() => sendChatRequest(requestname)}>Send request</button>
      </div>
      <div>
        <h2>Chat Requests</h2>
        <div>
          {chatRequests.map((request, index) => (
            <div key={index}>
              {(request.status === 'pending' || request.status === 'declined') && (
                <>
                  <div>{`From: ${request.from}, To: ${request.to}, Status: ${request.status}`}</div>
                  <button onClick={() => acceptChatRequest(request._id)}>Accept</button>
                  <button onClick={() => declineChatRequest(request._id)}>Decline</button>
                </>
              )}
              <button onClick={() => setActiveChat(request)}>Chat</button>
            </div>
          ))}
        </div>
      </div>


      <div>
        <h2>online Users</h2>
        <ul className={styles.usernamelist}>
          {username.map((user, index) => (
            <li key={index} className={styles.usernameitem}>{user}</li> // Display each username
          ))}
        </ul>
      </div>


      <div>
        <h2>Friends</h2>
        <ul className={styles.usernamelist}>
          {friends.map((user, index) => (
            <li key={index} className={styles.usernameitem}>{user}</li> // Display each username
          ))}
        </ul>
      </div>



      <div>
        <h2>offline users</h2>
        <ul className={styles.usernamelist}>
          {offlineusers.map((user, index) => (
            <li key={index} className={styles.usernameitem}>{user}</li>
          ))}
        </ul>
      </div>





    </div>
  );
};

export default Testing;
