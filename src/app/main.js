
import React from 'react'
import ReactDom from 'react-dom'
import Editor from './editor'
import fs from 'fs'
import {remote} from 'electron'
import dispatcher from './dispatcher'
const {dialog,Menu, MenuItem} =remote

const template = [
  {
    label: 'File',
    submenu: [
      {label: 'new file', click () {
        dispatcher.dispatch({
          type: "NEW_FILE",
        });
       
        
         } },
         {label: 'open file', click () {
          dialog.showOpenDialog({properties: ['openFile'],filters:[{name: 'All Files', extensions: ['md']}]},filePath =>{
           dispatcher.dispatch({
             type: "OPEN_FILE",
             'filePath':filePath.toString(),
           });
          })
           
            } },
            // {label: 'save', click () {
            //   dispatcher.dispatch({
            //     type: "SAVE_FILE",
            //   });
               
            //     } },
                {label: 'save as', click () {
                  dialog.showSaveDialog({properties: ['saveFileAs'],filters:[{name: 'All Files', extensions: ['md']}]},filePath =>{
                   dispatcher.dispatch({
                     type: "SAVE_FILE_AS",
                     'filePath':filePath.toString(),
                   });
                  })
                   
                    } }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      {role: 'undo'},
      {role: 'redo'},
      {type: 'separator'},
      {role: 'cut'},
      {role: 'copy'},
      {role: 'paste'},
      {role: 'pasteandmatchstyle'},
      {role: 'delete'},
      {role: 'selectall'}
    ]
  },
  {
    label: 'View',
    submenu: [
      {role: 'reload'},
      {role: 'forcereload'},
      {role: 'toggledevtools'},
      {type: 'separator'},
      {role: 'resetzoom'},
      {role: 'zoomin'},
      {role: 'zoomout'},
      {type: 'separator'},
      {role: 'togglefullscreen'}
    ]
  },
  {
    role: 'window',
    submenu: [
      {role: 'minimize'},
      {role: 'close'}
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click () { require('electron').shell.openExternal('https://electron.atom.io') }
      }
    ]
  }
]
const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

// const menu = new Menu()
// menu.append(new MenuItem({label: 'MenuItem1', click() { console.log('item 1 clicked') }}))
// menu.append(new MenuItem({type: 'separator'}))
// menu.append(new MenuItem({label: 'MenuItem2', type: 'checkbox', checked: true}))

// window.addEventListener('contextmenu', (e) => {
//   e.preventDefault()
//   menu.popup(remote.getCurrentWindow())
// }, false)


// const filePath = dialog.showOpenDialog({properties: ['openFile'],filters:[{name: 'All Files', extensions: ['md']}]})

// dispatcher.dispatch({
//   type: "OPEN_FILE",
//   'filePath':filePath.toString(),
// });

// const source = fs.readFileSync(filePath.toString(),'utf8')



//console.log(dialog)

const source = ''


const app = document.querySelector('#app')
console.log('must work this or')

ReactDom.render(<Editor source = {source}/>,app)