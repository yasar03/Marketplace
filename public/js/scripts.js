const socket = io();

document.getElementById('chat-form').addEventListener('submit', event => {
  event.preventDefault();
  const input = document.getElementById('m');
  socket.emit('chat message', input.value);
  input.value = '';
});

socket.on('chat message', msg => {
  const item = document.createElement('li');
  item.textContent = msg;
  document.getElementById('messages').appendChild(item);
});

// Example of appending a message to the chat window
function appendMessage(message, sender) {
    const chatWindow = document.getElementById('chat-window');
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message');
  
    const senderElement = document.createElement('div');
    senderElement.classList.add('sender');
    senderElement.textContent = sender;
    messageElement.appendChild(senderElement);
  
    const contentElement = document.createElement('div');
    contentElement.classList.add('message-content');
    contentElement.classList.add(sender === 'You' ? 'user' : 'other');
    contentElement.textContent = message;
    messageElement.appendChild(contentElement);
  
    chatWindow.appendChild(messageElement);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }
  