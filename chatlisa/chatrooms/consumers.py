import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import AsyncWebsocketConsumer

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f"chat_{self.room_name}"
        print(f'Room Scope: {self.scope}')
        print(f'Room Name: {self.room_name}')
        print(f'Room group name: {self.room_group_name}')

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name, self.channel_name
            )
        
        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name, self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        print(f"Receiver's text data: {text_data_json}")
        
        message = text_data_json['message']
        print(f"Receiver's message: {message}")

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name, {'type': 'chat.message', 'message': message}
        )

    async def chat_message(self, event):
        message = event['message']
        print(f'Chat Message: {message}')

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        })) 