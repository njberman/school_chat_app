const socket = io();
const messageContainer = document.getElementById('message-container');
const roomContainer = document.getElementById('room-container');
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');

socket.on('get-master-password', (pwd) => {
//   if (!Cookies.get('signed_in')) {
//     while (true) {
//       const result = prompt('Please enter the master password');
//       if (result === pwd) {
//         Cookies.set('signed_in', true, { SameSite: 'Lax' });
//         break;
//       }
//     }
//   }

  if (messageForm != null) {
    while (true) {
      const name = prompt('What is your name?');
      if (name.length > 0) {
        appendMessage('You joined');
        socket.emit('new-user', roomName, name);
        break;
      }
    }
    messageForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const message = messageInput.value;
      appendMessage(`You: ${message}`);
      socket.emit('send-chat-message', roomName, message);
      messageInput.value = '';
    });
  }

  socket.on('room-created', (room) => {
    const roomElement = document.createElement('div');
    roomElement.innerText = room;
    const roomLink = document.createElement('a');
    roomLink.href = `/${room}`;
    roomLink.innerText = 'join';
    roomContainer.append(roomElement);
    roomContainer.append(roomLink);
  });

  socket.on('chat-message', (data) => {
    appendMessage(`${data.name}: ${data.message}`);
  });

  socket.on('user-connected', (name) => {
    appendMessage(`${name} connected`);
  });

  socket.on('user-disconnected', (name) => {
    appendMessage(`${name} disconnected`);
  });

  function appendMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageContainer.append(messageElement);
    window.scrollTo(0, document.body.scrollHeight);
  }
});
