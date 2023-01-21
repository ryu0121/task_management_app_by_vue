<template>
  <div class="mx-3">
    <div class="d-flex justify-content-start">
      <CreateSection :isDisabled="isDisabled" v-model="sectionName" @click="createSection" />
      <div class="ms-3 mt-1 d-flex justify-content-center">
        <button class="me-2 display-button" style="width: 5em; height: 2em;"
          :class="{ 'button-not-active': !displayOptions.displayAll, 'button-active': displayOptions.displayAll }"
          @click="onClickDisplayButton('displayAll')" >全て表示</button>
        <button class="me-2 display-button" style="width: 8em; height: 2em;"
          :class="{ 'button-not-active': !displayOptions.displayOnlyActive, 'button-active': displayOptions.displayOnlyActive }"
          @click="onClickDisplayButton('displayOnlyActive')" >未完了だけ表示</button>
        <button class="me-2 display-button" style="width: 8em; height: 2em;"
          :class="{ 'button-not-active': !displayOptions.displayOnlyDone, 'button-active': displayOptions.displayOnlyDone }"
          @click="onClickDisplayButton('displayOnlyDone')" >完了だけ表示</button>
      </div>
    </div>
    <TaskSections :sections="displayedSections" @onChangeNewTaskTitle="onChangeNewTaskTitle" @createTaskDraft="createTaskDraft"
      @completeCreateTask="completeCreateTask" @deleteTask="deleteTask" @doneTask="doneTask"
      @deleteTaskDraft="deleteTaskDraft" @returnTaskToActive="returnTaskToActive" @toTaskEditing="toTaskEditing"
      @activateTask="activateTask" />
  </div>
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
      displayOptions: { displayAll: true, displayOnlyActive: false, displayOnlyDone: false }
    }
  },
  computed: {
    isDisabled() {
      return this.sectionName === ''
    },
    displayedSections() {
      if (this.displayOptions['displayAll']) {
        return this.sections
      }
      if (this.displayOptions['displayOnlyActive']) {
        return this.sections.includeOnlyActiveTasks()
      }
      if (this.displayOptions['displayOnlyDone']) {
        return this.sections.includeOnlyDoneTasks()
      }
      return this.sections
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
    deleteTask(taskId, sectionId) {
      const section = sections.findById(sectionId)
      this.sections.deleteTaskFromSection(taskId, section.id)
    },
    doneTask(taskId, sectionId) {
      const section = sections.findById(sectionId)
      this.sections.doneTaskOfSection(taskId, section.id)
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
    returnTaskToActive(taskId, sectionId) {
      const section = sections.findById(sectionId)
      this.sections.activateTaskOfSection(taskId, section.id)
    },
    toTaskEditing(taskId, sectionId) {
      const section = sections.findById(sectionId)
      this.sections.taskToEditingOfSection(taskId, section.id)
    },
    activateTask(taskId, sectionId) {
      const section = sections.findById(sectionId)
      this.sections.activateTaskOfSection(taskId, section.id)
    },
    onClickDisplayButton(option) {
      // クリックしたボタンがアクティブだったら何もしない
      if (this.displayOptions[option]) return;

      // 他の表示に切り替える場合は、選んだオプションと元々アクティブだったオプションの表示を入れ替える
      Object.keys(this.displayOptions).forEach((opt) => {
        if (this.displayOptions[opt]) {
          this.displayOptions[opt] = !this.displayOptions[opt]
        }
        if (opt === option) {
          this.displayOptions[opt] = !this.displayOptions[opt]
        }
      })
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

.display-button {
  border-radius: 10px;
}

.button-not-active {
  border-color: #33CCFF;
  background-color: white;
}

.button-active {
  background-color: #33CCFF;
  border: none;
  opacity: 0.8;
}

.button-not-active:hover {
  opacity: 0.6;
}
</style>
