<script setup>
import { defineProps } from 'vue'

import { Sections } from '../../domain/Task'
import TaskSection from './TaskSection.vue'

defineProps({
  sections: Sections,
  displayOptions: Object
})
// NOTE ここにコメントを入れないとハイライトがおかしくなる
</script>

<template>
  <div class="d-flex justify-content-start mx-3">
    <div v-for="section in sections.items" :key="section.id" class="mx-3">
      <TaskSection
        :section="section"
        :displayOptions="displayOptions"
        @createTaskDraft="$emit('createTaskDraft', section.id)"
        @completeCreateTask="$emit('completeCreateTask', $event, section.id)"
        @deleteTask="$emit('deleteTask', $event, section.id)"
        @doneTask="$emit('doneTask', $event, section.id)"
        @deleteTaskDraft="$emit('deleteTaskDraft', $event, section.id)"
        @returnTaskToActive="$emit('returnTaskToActive', $event, section.id)"
        @toTaskEditing="$emit('toTaskEditing', $event, section.id)"
        @activateTask="$emit('activateTask', $event, section.id)"
        @changeTaskOrderByDrag="$emit('changeTaskOrderByDrag', $event, section.id)" />
    </div>
  </div>
</template>
