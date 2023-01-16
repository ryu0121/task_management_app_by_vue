<template>
  <h3 class="d-flex justify-content-center">{{ section.name }}</h3>
  <div v-for="task in section.tasks" :key="task.id">
    <div class="card m-2" style="width: 18rem;">
      <div v-if="task.status === Active" class="card-body">
        <h5 class="card-title pt-2">{{ task.title }}</h5>
        <p class="card-text mt-2">{{ task.content }}</p>
      </div>
      <div v-else-if="task.status === Draft" class="card-body">
        <input class="card-title pt-2" placeholder="タイトル"
          v-model="newTaskTitle" />
        <textarea class="card-text mt-2" placeholder="内容"
          v-model="newTaskContent"
        ></textarea>
        <div class="mt-3 d-flex justify-content-center">
          <div class="mr-3">
            <button @click="completeCreateTask(task.id)" class="px-2">作成</button>
          </div>
          <div class="ml-3">
            <button @click="deleteTaskDraft(task.id)" class="px-2">キャンセル</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div>
    <button @click="$emit('createTaskDraft')">+</button>
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
      newTaskTitle: '',
      newTaskContent: '',
    }
  },
  created() {
    this.Active = TaskStatus.Active
    this.Draft = TaskStatus.Draft
  },
  emits: ['createTaskDraft', 'deleteTaskDraft', 'completeCreateTask'],
  methods: {
    completeCreateTask(taskId) {
      this.$emit('completeCreateTask', { taskId, newTaskTitle: this.newTaskTitle, newTaskContent: this.newTaskContent })
      this.newTaskTitle = ''
      this.newTaskContent = ''
    },
    deleteTaskDraft(taskId) {
      this.$emit('deleteTaskDraft', taskId)
      this.newTaskTitle = ''
      this.newTaskContent = ''
    }
  },
}
</script>
