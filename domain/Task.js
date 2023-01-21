export class Sections {
  constructor(items) {
    this.items = items
  }

  copy() {
    const copied = new Sections([])
    for (const section of this.items) {
      const copySection = new Section(section.name, section.id)

      for (const task of section.tasks) {
        const copyTask = task
        copySection.push(copyTask)
      }
      copied.push(copySection)
    }

    return copied
  }

  push(section) {
    return this.items.push(section)
  }

  findById(id) {
    let result;
    this.items.forEach(item => {
      if (item.id === id) {
        result = item
      }
    });

    return result
  }

  getSectionIndex(sectionId) {
    let index;
    this.items.forEach((section, i) => {
      if (section.id === sectionId) {
        index = i
      }
    });

    return index
  }

  deleteSection(sectionId) {
    const index = this.getSectionIndex(sectionId)
    this.items.splice(index, 1)
  }

  insertTaskToSection(task, sectionId) {
    let section
    this.items.forEach(item => {
      if (item.id === sectionId) {
        section = item
      }
    });

    section.push(task)
  }

  deleteTaskFromSection(taskId, sectionId) {
    const section = this.findById(sectionId)
    const taskIndex = section.getTaskIndex(taskId)
    section.tasks.splice(taskIndex, 1)
  }

  completeCreateTask(taskId, sectionId, payload) {
    const section = this.findById(sectionId)
    const task = section.findTaskById(taskId)
    task.activate(payload)
  }

  doneTaskOfSection(taskId, sectionId) {
    const section = this.findById(sectionId)
    const task = section.findTaskById(taskId)
    task.toDone()
  }

  activateTaskOfSection(taskId, sectionId) {
    const section = this.findById(sectionId)
    const task = section.findTaskById(taskId)
    task.toActivate()
  }

  taskToEditingOfSection(taskId, sectionId) {
    const section = this.findById(sectionId)
    const task = section.findTaskById(taskId)
    task.toEditing()
  }
}

export class Section {
  constructor(name = '', id = '') {
    this.id = id === '' ? getUniqueStr() : id
    this.tasks = []
    this.name = name
  }

  push(task) {
    this.tasks.push(task)
  }

  getTaskIndex(taskId) {
    let index;
    this.tasks.forEach((task, i) => {
      if (task.id === taskId) {
        index = i
      }
    });

    return index
  }

  findTaskById(taskId) {
    let result;
    this.tasks.forEach(task => {
      if (task.id === taskId) {
        result = task
      }
    });

    return result
  }
}

export const TaskStatus = {
  Draft: "DRAFT",
  Active: "ACTIVE",
  Editing: "EDITING",
  Done: "DONE",
}

export class Task {
  constructor({ title = '', content = '', sectionId }) {
    this.id = getUniqueStr()
    this.title = title
    this.content = content
    this.status = TaskStatus.Draft
    this.sectionId = sectionId
  }

  copy() {
    const newTask = new Task({ title: this.title, content: this.content, sectionId: this.sectionId })
    newTask.id = this.id
    newTask.status = this.status

    return newTask
  }

  activate(payload) {
    this.toActivate()
    this.title = payload.title
    this.content = payload.content
  }

  toDone() {
    this.status = TaskStatus.Done
  }

  toActivate() {
    this.status = TaskStatus.Active
  }

  toEditing() {
    this.status = TaskStatus.Editing
  }

  isDraft() {
    return this.status === TaskStatus.Draft
  }

  isDone() {
    return this.status === TaskStatus.Done
  }

  isActive() {
    return this.status === TaskStatus.Active
  }

  isEditing() {
    return this.status === TaskStatus.Editing
  }
}

function getUniqueStr(){
  var strong = 1000;
  return new Date().getTime().toString(16)  + Math.floor(strong*Math.random()).toString(16)
}