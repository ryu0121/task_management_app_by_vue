<script setup>
import { defineEmits, defineProps, ref } from 'vue'

import { Section } from '../../domain/Task'

defineProps({
  section: Section,
  displayOptions: Object,
  modelValue: String,
})

const emit = defineEmits([
  'createTaskDraft',
  'deleteTaskDraft',
  'completeCreateTask',
  'deleteTask',
  'doneTask',
  'returnTaskToActive',
  'toTaskEditing',
  'activateTask'
])

const tmpTasks = ref({})

const completeCreateTask = (taskId) => {
  const title = tmpTasks.value[taskId].title
  const content = tmpTasks.value[taskId].content
  emit('completeCreateTask', { taskId, newTaskTitle: title, newTaskContent: content })
  delete tmpTasks.value[taskId]
}

const deleteTaskDraft = (task) => {
  if (task.isDraft()) {
    emit('deleteTaskDraft', task.id)
    delete tmpTasks.value[task.id]
  }
  if (task.isEditing()) {
    emit('activateTask', task.id)
    delete tmpTasks.value[task.id]
  }
}

const deleteTask = (taskId) => {
  const ok = confirm('タスクを削除します。よろしいですか？')
  if (!ok) return;

  emit('deleteTask', taskId)
}

const doneTask = (taskId) => {
  emit('doneTask', taskId)
}

const returnTaskToActive = (taskId) => {
  const ok = confirm('タスクを未完了に戻します。よろしいですか？')
  if (!ok) return;

  emit('returnTaskToActive', taskId)
}

const toEditing = (task) => {
  tmpTasks.value[task.id] = { ...tmpTasks.value[task.id], title: task.title, content: task.content }
  emit('toTaskEditing', task.id)
}

const inputTitle = (taskId, v) => {
  tmpTasks.value[taskId] = { ...tmpTasks.value[taskId], title: v }
}

const inputContent = (taskId, v) => {
  tmpTasks.value[taskId] = { ...tmpTasks.value[taskId], content: v }
}

const isDisableCreateButton = (taskId) => {
  return typeof tmpTasks.value[taskId] === 'undefined'
    || typeof tmpTasks.value[taskId].title === 'undefined'
    || typeof tmpTasks.value[taskId].content === 'undefined'
    || tmpTasks.value[taskId].title === ''
    || tmpTasks.value[taskId].content === ''
}
</script>

<template>
  <h3 class="d-flex justify-content-center">{{ section.name }}</h3>
  <div v-for="task in section.tasks" :key="task.id">
    <div class="card m-2" style="width: 18rem;">
      <div v-if="task.isActive()" class="d-flex justify-content-end m-2">
        <font-awesome-icon
          @click="toEditing(task)"
          icon="fa-solid fa-pen-to-square"
          class="button-hover secondary" />
      </div>
      <div v-if="task.isActive() || task.isDone()" class="card-body">
        <h5 class="card-title pt-2">{{ task.title }}</h5>
        <p class="card-text mt-2">{{ task.content }}</p>
        <div class="d-flex justify-content-between">
          <div class="d-flex justify-content-end">
            <font-awesome-icon v-if="task.isActive()"
              @click="doneTask(task.id)"
              icon="fa-regular fa-circle-check"
              class="me-1 success button-hover" />
            <font-awesome-icon v-else-if="task.isDone()"
              icon="fa-solid fa-circle-check"
              class="me-1 success" />
            <font-awesome-icon @click="deleteTask(task.id)"
              icon="fa-regular fa-circle-xmark"
              class="failure button-hover" />
          </div>
          <font-awesome-icon v-if="task.isDone()"
            @click="returnTaskToActive(task.id)"
            icon="ffa-solid fa-arrow-rotate-left"
            class="me-1 secondary button-hover" />
        </div>
      </div>
      <div v-else-if="task.isDraft() || task.isEditing()" class="card-body">
        <input class="card-title pt-2" placeholder="タイトル"
          @input="inputTitle(task.id, $event.target.value)"
          :value="typeof tmpTasks[task.id] === 'undefined'
          ? '' : tmpTasks[task.id].title" />
        <textarea class="card-text mt-2" placeholder="内容"
          @input="inputContent(task.id, $event.target.value)"
          :value="typeof tmpTasks[task.id] === 'undefined'
          ? '' : tmpTasks[task.id].content" ></textarea>
        <div class="mt-3 d-flex justify-content-center">
          <div class="me-3">
            <button
              @click="completeCreateTask(task.id)"
              :disabled="isDisableCreateButton(task.id)"
              class="px-2 btn btn-primary">作成</button>
          </div>
          <div class="ml-3">
            <button @click="deleteTaskDraft(task)" class="px-2 btn btn-secondary">キャンセル</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-if="displayOptions.displayAll">
    <button @click="$emit('createTaskDraft')" class="btn btn-primary">+</button>
  </div>
</template>

<style scoped>
.success {
  color: green;
}

.failure {
  color: red;
}

.button-hover:hover {
  opacity: 0.6;
  cursor: pointer;
}
</style>