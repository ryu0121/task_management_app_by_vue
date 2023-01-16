<template>
  <CreateSection
    :isDisabled="isDisabled"
    v-model="sectionName"
    @click="createSection"
  />
  <TaskSections
    :sections="sections"
    @onChangeNewTaskTitle="onChangeNewTaskTitle"
    @createTaskDraft="createTaskDraft"
    @completeCreateTask="completeCreateTask"
    @deleteTaskDraft="deleteTaskDraft" />
</template>

<script>
import TaskSections from './components/TaskSections.vue'
import CreateSection from './components/CreateSection.vue'
import { Sections, Section, Task } from '../domain/Task'

const defaultSection = new Section('最初のセクションです')
const defaultTask = new Task({
  sectionId: defaultSection.id
})
defaultTask.activate({ title: 'タイトルです', content: '内容です' })

defaultSection.push(defaultTask)
const sections = new Sections([defaultSection])

export default {
  name: 'App',
  components: {
    CreateSection,
    TaskSections,
  },
  data() {
    return {
      sections: sections,
      sectionName: '',
      taskTitle: '',
    }
  },
  computed: {
    isDisabled() {
      return this.sectionName === ''
    },
  },
  methods: {
    createSection() {
      if (this.sectionName === '') return
      this.sections.push(new Section(this.sectionName))
      this.sectionName = ''
    },
    createTaskDraft(sectionId) {
      const section = sections.findById(sectionId)
      const task = new Task({ sectionId: section.id })
      this.sections.insertTaskToSection(task, section.id)
    },
    deleteTaskDraft(taskId, sectionId) {
      const section = sections.findById(sectionId)
      this.sections.deleteTaskFromSection(taskId, section.id)
    },
    completeCreateTask(payload, sectionId) {
      this.sections.completeCreateTask(
        payload.taskId,
        sectionId,
        {
          title: payload.newTaskTitle,
          content: payload.newTaskContent
        }
      )
    },
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
