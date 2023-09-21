from django.shortcuts import render
from django.views import View
from django.contrib.auth.mixins import LoginRequiredMixin
from .models import ChatRoom, Chat


class Index(LoginRequiredMixin, View):
    def get(self, request):
        return render(request, 'chatrooms/index.html')
    
class Room(LoginRequiredMixin, View):
    def get(self, request, room_name):
        room = ChatRoom.objects.filter(name=room_name).first()

        # To hold all of the chats for the room if we find a room 
        chats = []

        # If the room is not empty, we'll look for all the chats that are 
        # associated in that room
        if room:
            chats = Chat.objects.filter(room=room)
        else:
            room = ChatRoom(name=room_name)
            room.save()
            
        return render(request, "chatrooms/room.html", {'room_name': room_name})