<template>
  <div class="d-flex justify-content-start mx-3">
    <div v-for="section in sections.items" :key="section.id" class="mx-3">
      <TaskSection
        :section="section"
        @onChangeNewTaskTitle="onChangeNewTaskTitle"
        @createTaskDraft="$emit('createTaskDraft', section.id)"
        @completeCreateTask="$emit('completeCreateTask', $event, section.id)"
        @deleteTaskDraft="$emit('deleteTaskDraft', $event, section.id)" />
    </div>
  </div>
</template>

<script>
import { Sections } from '../../domain/Task'
import TaskSection from './TaskSection.vue'

export default {
  name: 'TaskSections',
  components: {
    TaskSection,
  },
  props: {
    sections: Sections
  },
  data() {
    return {
      newTaskTitle: '',
    }
  },
  methods: {
    onChangeNewTaskTitle(payload) {
      this.newTaskTitle = payload
      this.childEmit()
    },
    childEmit() {
      this.$emit('onChangeNewTaskTitle', this.newTaskTitle)
    }
  },
}
</script>
