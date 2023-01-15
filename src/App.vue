<template>
  <CreateSection
    :isDisabled="isDisabled"
    v-model="sectionName"
    @click="createSection"
  />
  <TaskSection :section="section" />
</template>

<script>
import TaskSection from './components/TaskSection.vue'
import CreateSection from './components/CreateSection.vue'
import { Sections, Section, Task } from '../domain/Task'

const defaultSection = new Section('最初のセクションです')
const defaultTask = new Task({
  title: 'タイトルです',
  content: '内容です',
  sectionId: defaultSection.id
})

defaultSection.push(defaultTask)
const sections = new Sections([defaultSection])

export default {
  name: 'App',
  components: {
    CreateSection,
    TaskSection,
  },
  data() {
    return {
      sections: sections,
      section: defaultSection,
      sectionName: '',
    }
  },
  computed: {
    isDisabled() {
      return this.sectionName === ''
    },
  },
  methods: {
    createSection() {
      console.log(this.sectionName)
      this.sections.push(new Section(this.sectionName))
      this.sectionName = ''
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
