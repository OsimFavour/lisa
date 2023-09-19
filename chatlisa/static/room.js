const chatLog = document.querySelector('#chat-log')

const roomName = JSON.parse(document.getElementById('room-name').textContent);
console.log('Room Name:', roomName)

if (!chatLog.hasChildNodes()) {
    const emptyText = document.createElement('h3')
    emptyText.id = 'emptyText'
    emptyText.innerText = 'No Messages'
    emptyText.className = 'emptyText'
    chatLog.appendChild(emptyText)
    console.log(emptyText)
}

const chatSocket = new WebSocket(
    'ws://'
    + window.location.host
    + '/ws/chat/'
    + roomName
    + '/'
);

// const chatSocket = new WebSocket('ws://127.0.0.1:8080/ws/chat/lobby', 'echo-protocol');

console.log('Here is the Chat Socket:', chatSocket)

chatSocket.onmessage = function(e) {
    const data = JSON.parse(e.data);
    // document.querySelector('#chat-log').value += (data.message + '\n');

    // Create a new message element
    const messageElement = document.createElement('div');
    messageElement.innerText = data.message
    messageElement.className = 'message'

    // Append the message element to the chatLog container
    chatLog.appendChild(messageElement)
    console.log(messageElement)
    
    

};

chatSocket.onclose = function(e) {
    console.error('Chat socket closed unexpectedly');
};

document.querySelector('#chat-message-input').focus();
document.querySelector('#chat-message-input').onkeyup = function(e) {
    if (e.key === 'Enter') {  // enter, return
        document.querySelector('#chat-message-submit').click();
    }
};

document.querySelector('#chat-message-submit').onclick = function(e) {
    const messageInputDom = document.querySelector('#chat-message-input');
    const message = messageInputDom.value;
    chatSocket.send(JSON.stringify({
        'message': message
    }));
    messageInputDom.value = '';
};