export class Sections {
  constructor(items) {
    this.items = items
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
}

export class Section {
  constructor(name = '') {
    this.id = getUniqueStr()
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
}

export class Task {
  constructor({ title = '', content = '', sectionId }) {
    this.id = getUniqueStr()
    this.title = title
    this.content = content
    this.status = TaskStatus.Draft
    this.sectionId = sectionId
  }

  activate(payload) {
    this.status = TaskStatus.Active
    this.title = payload.title
    this.content = payload.content
  }
}

function getUniqueStr(){
  var strong = 1000;
  return new Date().getTime().toString(16)  + Math.floor(strong*Math.random()).toString(16)
}