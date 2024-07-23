<template>
  <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white p-5 rounded-md w-[400px]">
      <h2 class="text-xl mb-4">Edit Task</h2>
      <input v-model="editedText" class="w-full p-2 mb-4 border rounded-md" />
      <div v-if="errorMessage" class="text-red-500 mb-4">{{ errorMessage }}</div>
      <div class="flex justify-end gap-2">
        <button @click="closeModal" class="px-4 py-2 border rounded-md">Cancel</button>
        <button @click="saveEdit" class="px-4 py-2 bg-blue-500 text-white rounded-md">Save</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits, watch } from 'vue';

const props = defineProps({
  isOpen: Boolean,
  todo: Object,
});

const emits = defineEmits(['close', 'save']);

const editedText = ref('');
const errorMessage = ref('');

watch(() => props.todo, (newVal) => {
  editedText.value = newVal ? newVal.text : '';
});

function closeModal() {
  emits('close');
  errorMessage.value = ''; 
}

function saveEdit() {
  if (!editedText.value.trim()) {
    errorMessage.value = 'Task cannot be empty';
    return;
  }
  emits('save', { ...props.todo, text: editedText.value });
  errorMessage.value = ''; 
}
</script>
