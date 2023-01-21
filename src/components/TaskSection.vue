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
  <div>
    <button @click="$emit('createTaskDraft')" class="btn btn-primary">+</button>
  </div>
</template>

<script>
import { Section, TaskStatus } from '../../domain/Task'

export default {
  name: 'TaskSection',
  props: {
    section: Section,
    modelValue: String,
  },
  data() {
    return {
      tmpTasks: {},
    }
  },
  created() {
    this.Active = TaskStatus.Active
    this.Draft = TaskStatus.Draft
  },
  emits: ['createTaskDraft', 'deleteTaskDraft', 'completeCreateTask', 'deleteTask', 'doneTask', 'returnTaskToActive', 'toEditing', 'activateTask'],
  methods: {
    completeCreateTask(taskId) {
      const title = this.tmpTasks[taskId].title
      const content = this.tmpTasks[taskId].content
      this.$emit('completeCreateTask', { taskId, newTaskTitle: title, newTaskContent: content })
      delete this.tmpTasks[taskId]
    },
    deleteTaskDraft(task) {
      if (task.isDraft()) {
        this.$emit('deleteTaskDraft', task.id)
        delete this.tmpTasks[task.id]
      }
      if (task.isEditing()) {
        this.$emit('activateTask', task.id)
        delete this.tmpTasks[task.id]
      }
    },
    deleteTask(taskId) {
      const ok = confirm('タスクを削除します。よろしいですか？')
      if (!ok) return;

      this.$emit('deleteTask', taskId)
    },
    doneTask(taskId) {
      this.$emit('doneTask', taskId)
    },
    returnTaskToActive(taskId) {
      const ok = confirm('タスクを未完了に戻します。よろしいですか？')
      if (!ok) return;

      this.$emit('returnTaskToActive', taskId)
    },
    toEditing(task) {
      this.tmpTasks[task.id] = { ...this.tmpTasks[task.id], title: task.title, content: task.content }
      this.$emit('toTaskEditing', task.id)
    },
    inputTitle(taskId, v) {
      this.tmpTasks[taskId] = { ...this.tmpTasks[taskId], title: v}
    },
    inputContent(taskId, v) {
      this.tmpTasks[taskId] = { ...this.tmpTasks[taskId], content: v }
    },
    isDisableCreateButton(taskId) {
      return typeof this.tmpTasks[taskId] === 'undefined'
        || typeof this.tmpTasks[taskId].title === 'undefined'
        || typeof this.tmpTasks[taskId].content === 'undefined'
        || this.tmpTasks[taskId].title === ''
        || this.tmpTasks[taskId].content === ''
    }
  },
}
</script>

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