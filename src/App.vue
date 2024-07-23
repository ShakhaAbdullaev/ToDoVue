<template>
  <div class="container">

    <div class="flex justify-center">
      <h1 class="font-semibold text-3xl glass p-2 my-5 w-[250px] text-center text-white">ToDo in <span
          class="text-[#42B883]">Vue.js</span>
      </h1>
    </div>

    <div class="flex gap-2 justify-center mb-5 text-2xl text-white font-thin">

      <p>{{ day }} |</p>
      <p>{{ date }} |</p>
      <p>{{ time }}</p>

    </div>

    <div class="glass p-5 rounded-md w-[750px] mx-auto min-h-[400px] mb-10">

      <div class="flex flex-col">

        <form @submit.prevent="addTodo" class="flex justify-center gap-3 mb-5">

          <input v-model="newTodo" required placeholder="Add Task"
            class="rounded-md outline-none p-2 glass text-white w-[300px]">

          <button
            class="px-5 py-2 rounded-md border text-white font-semibold hover:bg-white transition-all ease hover:text-black">ADD</button>

        </form>

        <Tabs :tabs="tabs" :currentTab="currentTab" @update:tab="currentTab = $event" />

        <ul v-if="todos.length > 0">

          <li v-for="todo in filteredTodos" :key="todo.id" class="flex justify-between text-white py-2">

            <span :class="{ 'line-through': todo.status === 'Done' }">{{ todo.text }}</span>

            <div class="flex gap-3">

              <button @click="toggleDone(todo)" class="p-2 bg-green-600 rounded-md">

                <svg v-if="todo.status === 'New'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: white;">
                  <path d="M10 17l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: white;">
                  <path d="M19 13H5v-2h14v2z"/>
                </svg>

              </button>

              <button @click="editTodo(todo)" class="p-2 bg-indigo-600 rounded-md">

                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: white">
                  <path d="m18.988 2.012 3 3L19.701 7.3l-3-3zM8 16h3l7.287-7.287-3-3L8 13z"></path>
                  <path
                    d="M19 19H8.158c-.026 0-.053.01-.079.01-.033 0-.066-.009-.1-.01H5V5h6.847l2-2H5c-1.103 0-2 .896-2 2v14c0 1.104.897 2 2 2h14a2 2 0 0 0 2-2v-8.668l-2 2V19z">
                  </path>
                </svg>

              </button>

              <button @click="removeTodo(todo)" class="p-2 bg-red-600 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: white;">
                  <path
                    d="M5 20a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8h2V6h-4V4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2H3v2h2zM9 4h6v2H9zM8 8h9v12H7V8z">
                  </path>
                  <path d="M9 10h2v8H9zm4 0h2v8h-2z"></path>
                </svg>
              </button>

            </div>

          </li>

        </ul>

        <NoTask v-else class="mt-10 mx-auto" />

      </div>

    </div>

    <EditModal :isOpen="isModalOpen" :todo="currentTodo" @close="isModalOpen = false" @save="saveTodoEdit" />

  </div>
</template>


<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import NoTask from './components/NoTask.vue';
import EditModal from './components/EditModal.vue';
import Tabs from './components/Tabs.vue';


const id = ref(0);
const newTodo = ref('')
const todos = ref([])
const isModalOpen = ref(false)
const currentTodo = ref(null)
const currentTab = ref('All')

const tabs = ['All', 'New', 'Done', 'Deleted'];

function addTodo() {
  todos.value.unshift({ id: id.value++, text: newTodo.value, status: 'New' })
  newTodo.value = ''
}

function removeTodo(todo) {
  const index = todos.value.findIndex((t) => t.id === todo.id);
  if (index !== -1) {
    todos.value[index].status = 'Deleted';
  }
}

function editTodo(todo) {
  currentTodo.value = todo;
  isModalOpen.value = true;
}

function toggleDone(todo) {
  todo.status = todo.status === 'New' ? 'Done' : 'New';
}

function saveTodoEdit(updatedTodo) {
  const index = todos.value.findIndex((t) => t.id === updatedTodo.id);
  if (index !== -1) {
    todos.value[index] = updatedTodo;
  }
  isModalOpen.value = false;
}

const filteredTodos = computed(() => {
  if (currentTab.value === 'All') return todos.value.filter((todo) => todo.status !== 'Deleted');
  if (currentTab.value === 'Deleted') return todos.value.filter((todo) => todo.status === 'Deleted');
  return todos.value.filter((todo) => todo.status === currentTab.value);
});

watch(todos, (newTodos) => {
  localStorage.setItem('todos', JSON.stringify(newTodos));
}, { deep: true });

onMounted(() => {
  const storedTodos = localStorage.getItem('todos');
  if (storedTodos) {
    todos.value = JSON.parse(storedTodos);
    id.value = todos.value.reduce((maxId, todo) => Math.max(maxId, todo.id), 0) + 1;
  }
});

const day = ref('');
const date = ref('');
const time = ref('');

function updateTime() {
  const now = new Date();
  day.value = now.toLocaleDateString('en-US', { weekday: 'long' });
  date.value = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  time.value = now.toLocaleTimeString('en-US');
}

onMounted(() => {
  updateTime();
  const interval = setInterval(updateTime, 1000);
  onUnmounted(() => clearInterval(interval));
});
</script>

<style scoped>
::placeholder {
  color: white;
}
</style>