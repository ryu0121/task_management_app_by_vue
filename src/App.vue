<script setup>
import { computed, ref } from 'vue'

import TaskSections from './components/TaskSections.vue'
import CreateSection from './components/CreateSection.vue'
import { Sections, Section, Task } from '../domain/Task'

const defaultSection = new Section('最初のセクションです')
const defaultTask = new Task({
  sectionId: defaultSection.id
})
const defaultTask2 = new Task({
  sectionId: defaultSection.id
})
const defaultTask3 = new Task({
  sectionId: defaultSection.id
})
defaultTask.activate({ title: 'タイトルです', content: '内容です' })
defaultTask2.activate({ title: 'タイトル2です', content: '内容2です' })
defaultTask3.activate({ title: 'タイトル3です', content: '内容3です' })
defaultSection.push(defaultTask)
defaultSection.push(defaultTask2)
defaultSection.push(defaultTask3)

// state
const sections = ref(new Sections([defaultSection]))
const sectionName = ref('')
const displayOptions = ref({
  displayAll: true,
  displayOnlyActive: false,
  displayOnlyDone: false
})

// reactive computation
const isDisabled = computed(() => sectionName.value === '')
const displayedSections = computed(() => {
  if (displayOptions.value['displayAll']) {
    return sections.value
  }

  const filtered = sections.value.copy()

  // 削除予定のsection
  const deleteSectionMemo = []
  for (const section of filtered.items) {
    // 削除予定のtask
    const deleteTaskMemo = []
    for (const task of section.tasks) {
      if (task.isDone() || task.isDraft() || task.isEditing()) {
        deleteTaskMemo.push({ taskId: task.id, sectionId: section.id })
      }
    }
    if (deleteTaskMemo.length === section.tasks.length) {
      deleteSectionMemo.push(section.id)
    }

    // 削除予定のtaskを削除
    for (const memo of deleteTaskMemo) {
      filtered.deleteTaskFromSection(memo.taskId, memo.sectionId)
    }
  }

  // 削除予定のsectionを削除
  for (const memo of deleteSectionMemo) {
    filtered.deleteSection(memo.sectionId)
  }

  if (displayOptions.value['displayOnlyDone']) {
    // 削除予定のsection
    const deleteSectionMemo = []
    for (const section of filtered.items) {
      // 削除予定のtask
      const deleteTaskMemo = []
      for (const task of section.tasks) {
        if (task.isActive() || task.isEditing() || task.isDraft()) {
          deleteTaskMemo.push({ taskId: task.id, sectionId: section.id })
        }
      }
      if (deleteTaskMemo.length === section.tasks.length) {
        deleteSectionMemo.push(section.id)
      }

      // 削除予定のtaskを削除
      for (const memo of deleteTaskMemo) {
        filtered.deleteTaskFromSection(memo.taskId, memo.sectionId)
      }
    }

    // 削除予定のsectionを削除
    for (const memo of deleteSectionMemo) {
      filtered.deleteSection(memo.sectionId)
    }

    return filtered
  }

  return sections.value
})
const includeDraft = computed(() => {
  for (const section of sections.value.items) {
    for (const task of section.tasks) {
      if (task.isDraft()) return true
    }
  }

  return false
})

// methods
const createSection = () => {
  if (sectionName.value === '') return
  sections.value.push(new Section(sectionName.value))
  sectionName.value = ''
}
const createTaskDraft = (sectionId) => {
  const section = sections.value.findById(sectionId)
  const task = new Task({ sectionId: section.id })
  sections.value.insertTaskToSection(task, section.id)
}
const deleteTaskDraft = (taskId, sectionId) => {
  const section = sections.value.findById(sectionId)
  sections.value.deleteTaskFromSection(taskId, section.id)
}
const deleteTask = (taskId, sectionId) => {
  const section = sections.value.findById(sectionId)
  sections.value.deleteTaskFromSection(taskId, section.id)
}
const doneTask = (taskId, sectionId) => {
  const section = sections.value.findById(sectionId)
  sections.value.doneTaskOfSection(taskId, section.id)
}
const completeCreateTask = (payload, sectionId) => {
  sections.value.completeCreateTask(
    payload.taskId,
    sectionId,
    {
      title: payload.newTaskTitle,
      content: payload.newTaskContent
    }
  )
}
const returnTaskToActive = (taskId, sectionId) => {
  const section = sections.value.findById(sectionId)
  sections.value.activateTaskOfSection(taskId, section.id)
}
const toTaskEditing = (taskId, sectionId) => {
  const section = sections.value.findById(sectionId)
  sections.value.taskToEditingOfSection(taskId, section.id)
}
const activateTask = (taskId, sectionId) => {
  const section = sections.value.findById(sectionId)
  sections.value.activateTaskOfSection(taskId, section.id)
}
const onClickDisplayButton = (option) => {
  // クリックしたボタンがアクティブだったら何もしない
  if (displayOptions.value[option]) return;

  // 他の表示に切り替える場合は、選んだオプションと元々アクティブだったオプションの表示を入れ替える
  Object.keys(displayOptions.value).forEach((opt) => {
    if (displayOptions.value[opt]) {
      displayOptions.value[opt] = !displayOptions.value[opt]
    }
    if (opt === option) {
      displayOptions.value[opt] = !displayOptions.value[opt]
    }
  })
}
</script>

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
          :disabled="includeDraft"
          @click="onClickDisplayButton('displayOnlyActive')" >未完了だけ表示</button>
        <button class="me-2 display-button" style="width: 8em; height: 2em;"
          :class="{ 'button-not-active': !displayOptions.displayOnlyDone, 'button-active': displayOptions.displayOnlyDone }"
          :disabled="includeDraft"
          @click="onClickDisplayButton('displayOnlyDone')" >完了だけ表示</button>
      </div>
    </div>
    <TaskSections
      :sections="displayedSections" :displayOptions="displayOptions"
      @createTaskDraft="createTaskDraft"
      @completeCreateTask="completeCreateTask" @deleteTask="deleteTask" @doneTask="doneTask"
      @deleteTaskDraft="deleteTaskDraft" @returnTaskToActive="returnTaskToActive" @toTaskEditing="toTaskEditing"
      @activateTask="activateTask" />
  </div>
</template>

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
