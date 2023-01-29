<script setup>
import { defineEmits, defineProps, computed, ref } from 'vue'

import { Section } from '../../domain/Task'

const props = defineProps({
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
  'activateTask',
  'changeTaskOrderByDrag',
])

const tmpTasks = ref({})

const completeCreateTask = (taskId) => {
  const title = tmpTasks.value[taskId].title
  const content = tmpTasks.value[taskId].content
  emit('completeCreateTask', { taskId, newTaskTitle: title, newTaskContent: content })
  delete tmpTasks.value[taskId]
}

const tasks = computed({
  get: () => props.section.tasks,
  set: (tasks) => {
    emit('changeTaskOrderByDrag', tasks)
  }
})

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
    <draggable v-model="tasks" item-key="id" group="task" :options="{ group: 'task', animation: 150 }" handle='.handle'  >
      <template #item="{element}">
        <div class="card m-2" style="width: 18rem;">
          <div class="handle">::::::::::::::::</div>
          <div v-if="element.isActive()" class="d-flex justify-content-end m-2">
            <font-awesome-icon @click="toEditing(element)" icon="fa-solid fa-pen-to-square" class="button-hover secondary" />
          </div>
          <div v-if="element.isActive() || element.isDone()" class="card-body">
            <h5 class="card-title pt-2">{{ element.title }}</h5>
            <p class="card-text mt-2">{{ element.content }}</p>
            <div class="d-flex justify-content-between">
              <div class="d-flex justify-content-end">
                <font-awesome-icon v-if="element.isActive()" @click="doneTask(element.id)" icon="fa-regular fa-circle-check"
                  class="me-1 success button-hover" />
                <font-awesome-icon v-else-if="element.isDone()" icon="fa-solid fa-circle-check" class="me-1 success" />
                <font-awesome-icon @click="deleteTask(element.id)" icon="fa-regular fa-circle-xmark"
                  class="failure button-hover" />
              </div>
              <font-awesome-icon v-if="element.isDone()" @click="returnTaskToActive(element.id)" icon="ffa-solid fa-arrow-rotate-left"
                class="me-1 secondary button-hover" />
            </div>
          </div>
          <div v-else-if="element.isDraft() || element.isEditing()" class="card-body">
            <input class="card-title pt-2" placeholder="タイトル" @input="inputTitle(element.id, $event.target.value)" :value="typeof tmpTasks[element.id] === 'undefined'
            ? '' : tmpTasks[element.id].title" />
            <textarea class="card-text mt-2" placeholder="内容" @input="inputContent(element.id, $event.target.value)" :value="typeof tmpTasks[element.id] === 'undefined'
            ? '' : tmpTasks[element.id].content"></textarea>
            <div class="mt-3 d-flex justify-content-center">
              <div class="me-3">
                <button @click="completeCreateTask(element.id)" :disabled="isDisableCreateButton(element.id)"
                  class="px-2 btn btn-primary">作成</button>
              </div>
              <div class="ml-3">
                <button @click="deleteTaskDraft(element)" class="px-2 btn btn-secondary">キャンセル</button>
              </div>
            </div>
          </div>
        </div>
      </template>
    </draggable>
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

.handle:hover {
  cursor: grab;
}
</style>