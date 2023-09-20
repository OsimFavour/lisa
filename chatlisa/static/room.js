const chatLog = document.querySelector('#chat-log')

const roomName = JSON.parse(document.getElementById('room-name').textContent);
console.log('Room Name:', roomName)

  
// To Indicate that there are no messages
if (!chatLog.hasChildNodes()) {
    const emptyText = document.createElement('h3')
    emptyText.id = 'emptyText'
    emptyText.innerText = 'No Messages'
    emptyText.className = 'emptyText'
    chatLog.appendChild(emptyText)
    console.log(emptyText)
}

// const text_to_remove = document.querySelector('#emptyText')
// console.log('Here is the text to remove', text_to_remove)
// if (text_to_remove) {
//     text_to_remove.remove()
// }

// Connect to the Websocket
const chatSocket = new WebSocket(
    'ws://'
    + window.location.host
    + '/ws/chat/'
    + roomName
    + '/'
);

console.log('Here is the Chat Socket:', chatSocket)

// Create and display chat socket message
chatSocket.onmessage = function(e) {
    const data = JSON.parse(e.data);
    // document.querySelector('#chat-log').value += (data.message + '\n');

    // Create a new message element
    const messageElement = document.createElement('div')
    messageElement.innerText = data.message
    messageElement.className = 'message'

    // Append the message element to the chatLog container
    chatLog.appendChild(messageElement)
    console.log(messageElement)

    // Remove 'No Messages' text if there is a message
    if (document.querySelector('#emptyText')) {
        document.querySelector('#emptyText').remove()
    }

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