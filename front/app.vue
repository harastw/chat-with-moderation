<template>
  <div class="min-h-screen bg-gray-100 flex flex-col items-center p-4">
    <div v-if="!user" class="w-full max-w-sm">
      <input
        v-model="nickname"
        type="text"
        placeholder="Enter your nickname"
        class="w-full p-2 mb-2 border border-gray-300 rounded"
      />
      <button
        @click="createUser"
        class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
      >
        Create User
      </button>
    </div>

    <div v-else class="w-full max-w-lg">
      <div class="mb-4">
        <input
          v-model="channelName"
          type="text"
          placeholder="Enter channel name"
          class="w-full p-2 mb-2 border border-gray-300 rounded"
        />
        <button
          @click="createChannel"
          class="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          Create Channel
        </button>
      </div>

      <div v-if="currentChannel" class="mb-4">
        <h2 class="text-xl font-bold mb-2">
          Channel: {{ currentChannel.name }}
        </h2>
        <ul class="mb-4">
          <li
            v-for="user in currentChannel.users"
            :key="user.id"
            class="flex justify-between items-center p-2 bg-white rounded mb-1 shadow"
          >
            {{ user.nickname }}
            <button
              @click="removeUser(user.id)"
              class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
            >
              Remove
            </button>
          </li>
        </ul>

        <div class="mb-4">
          <input
            v-model="message"
            type="text"
            placeholder="Enter your message"
            class="w-full p-2 mb-2 border border-gray-300 rounded"
          />
          <button
            @click="sendMessage"
            class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Send Message
          </button>
        </div>

        <div class="bg-gray-200 p-4 rounded shadow">
          <h3 class="text-lg font-semibold mb-2">Messages:</h3>
          <ul>
            <li v-for="(msg, index) in messages" :key="index" class="mb-1">
              <span class="font-bold">{{ msg.user.nickname }}:</span>
              {{ msg.message }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { io } from "socket.io-client";

interface User {
  id: string;
  nickname: string;
}

interface Channel {
  id: string;
  name: string;
  users: User[];
}

interface Message {
  user: User;
  message: string;
}

const socket = io("ws://127.0.0.1:5173");

const nickname = ref("");
const user = ref<User | null>(null);
const channelName = ref("");
const currentChannel = ref<Channel | null>(null);
const message = ref("");
const messages = ref<Message[]>([]);

const createUser = () => {
  socket.emit("addUser", nickname.value, (newUser: User) => {
    user.value = newUser;
  });
};

const createChannel = () => {
  if (user.value) {
    socket.emit("createChannel", { name: channelName.value, creatorId: user.value.id }, (newChannel: Channel) => {
      currentChannel.value = newChannel;
    });
  }
};

const sendMessage = () => {
  if (user.value && currentChannel.value) {
    socket.emit("sendMessage", {
      channelId: currentChannel.value.id,
      userId: user.value.id,
      message: message.value,
    });
    message.value = "";
  }
};

const removeUser = (userId: string) => {
  if (user.value && currentChannel.value) {
    socket.emit("removeUser", {
      channelId: currentChannel.value.id,
      userId,
      removerId: user.value.id,
    });
  }
};

onMounted(() => {
  socket.on("message", (data: { user: User; message: string }) => {
    messages.value.push(data);
  });

  socket.on("userRemoved", (data: { channelId: string; userId: string }) => {
    if (currentChannel.value?.id === data.channelId) {
      currentChannel.value.users = currentChannel.value.users.filter(u => u.id !== data.userId);
    }
  });

  socket.on("userJoined", (data: { channelId: string; user: User }) => {
    if (currentChannel.value?.id === data.channelId) {
      currentChannel.value.users.push(data.user);
    }
  });
});
</script>
