<template>
  <div v-for="task in section.tasks" :key="task.id">
    <div class="card m-2" style="width: 18rem;">
      <div class="card-body">
        <h5 class="card-title pt-2">{{ task.title }}</h5>
        <p class="card-text">{{ task.content }}</p>
        <p class="card-text">{{ task.sectionId }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { Section } from '../../domain/Task'

export default {
  name: 'TaskSection',
  props: {
    section: Section
  }
}
</script>
