const socket = io();

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");
var audioMsg = new Audio('whatsapp_incoming.mp3');
var audioJoinLeave = new Audio('join-leave.mp3');


function scrollToBottom() {
    messageContainer.scrollTop = messageContainer.scrollHeight
}

function append(message, msgClass, position) {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add(position, msgClass);
    messageContainer.appendChild(messageElement);
    audioJoinLeave.play();
}

const sender = 'You';

function sendMessage(message) {
    let msg = {
        name: sender,
        message: message.trim()
    }
    // Append 
    appendMessage(msg, 'sent');
    messageInput.value = '';
    scrollToBottom();

    // Send to server 
    socket.emit('send', message);
}

function appendMessage(data, type) {
    const messageElement = document.createElement('div');
    let className = type;
    messageElement.classList.add(className, 'message');

    let markup = `
        <h4>${data.name}</h4>
        <p>${data.message}</p>
    `
    messageElement.innerHTML = markup;
    messageContainer.appendChild(messageElement);
    if (type === 'received') {
        audioMsg.play();
    }
}

form.addEventListener('submit', function (e) {
    e.preventDefault();
    const message = messageInput.value;
    sendMessage(message, 'sent');
});

const name = prompt("Enter your name to join");
socket.emit('new-user-joined', name);

socket.on('user-joined', function (name) {
    append(`${name} joined the chat`, 'new-join-msg', 'join');
});

socket.on('receive', function (data) {
    appendMessage(data, 'received');
    scrollToBottom();
});

socket.on('leave', function (name) {
    append(`${name} left the chat`, 'new-join-msg', 'join');
});
