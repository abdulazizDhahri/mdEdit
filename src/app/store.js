
import {EventEmitter} from 'events'
import dispatcher from './dispatcher'
import {Plain } from 'slate'
import fs from 'fs'

class DocStore extends EventEmitter {
  constructor() {
  super()
  this.content = Plain.deserialize("")
  this.fileName = 'undifien'
  this.filePath = undefined
  }
  getContent() {
    return this.content
  }
  updateContent(text) {
    this.content = text
    this.saveFile()
    this.emit('content update',this.content)
  }

  changeFile(filePath) {
    console.log('file',filePath)
    const file = fs.readFileSync(filePath,'utf8')
    this.content = Plain.deserialize(file)
    this.filePath = filePath;
    const p = this.filePath.split('/') 
    this.fileName = p[p.length -1]
    this.emit('content update',this.content)
  }

  saveFile(){
    if(this.filePath) {
      const fileSource = Plain.serialize(this.content)
      fs.writeFileSync(this.filePath,fileSource,'utf8')
    }
    
  }

  reset() {
    this.content = Plain.deserialize("")
    this.fileName = 'undifien'
    this.filePath = undefined
    this.emit('content update',this.content)
  }

  saveNewFile(filePath){
    this.fileName = filePath
    const p = this.filePath.split('/') 
    this.fileName = p[p.length -1]
    const fileSource = Plain.serialize(this.content)
    fs.writeFileSync(filePath,fileSource,'utf8')
    // console.log('save',this.content.texts)
  }

  handleActions(action) {
    
    switch(action.type) {
      case "UPDATE_CONTENT": {
        this.updateContent(action.state);
        break;
      }
      case "OPEN_FILE": {
        this.changeFile(action.filePath);
        break;
      }
      case "NEW_FILE": {
        this.reset();
        break;
      }
      case "SAVE_FILE_AS": {
        this.saveNewFile(action.filePath);
        break;
      }
    }
  }
}
const docStore = new DocStore()
dispatcher.register(docStore.handleActions.bind(docStore));

export default docStore