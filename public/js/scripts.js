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
