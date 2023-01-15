export class Sections {
  constructor(items) {
    this.items = items
  }

  push(section) {
    return this.items.push(section)
  }
}

export class Section {
  constructor(name) {
    this.id = getUniqueStr()
    this.tasks = []
    this.name = name
  }

  push(task) {
    return this.tasks.push(task)
  }
}

export class Task {
  constructor({ title, content, sectionId }) {
    this.id = getUniqueStr()
    this.title = title
    this.content = content
    this.sectionId = sectionId
  }
}

function getUniqueStr(){
  var strong = 1000;
  return new Date().getTime().toString(16)  + Math.floor(strong*Math.random()).toString(16)
}