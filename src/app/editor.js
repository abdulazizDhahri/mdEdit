
import { Editor, Mark, Plain } from 'slate'
import Prism from 'prismjs'
import React from 'react'
import DocStore from './store'
import dispatcher from './dispatcher'

/**
 * Add the markdown syntax to Prism.
 */

// eslint-disable-next-line
Prism.languages.markdown=Prism.languages.extend("markup",{}),Prism.languages.insertBefore("markdown","prolog",{blockquote:{pattern:/^>(?:[\t ]*>)*/m,alias:"punctuation"},code:[{pattern:/^(?: {4}|\t).+/m,alias:"keyword"},{pattern:/``.+?``|`[^`\n]+`/,alias:"keyword"}],title:[{pattern:/\w+.*(?:\r?\n|\r)(?:==+|--+)/,alias:"important",inside:{punctuation:/==+$|--+$/}},{pattern:/(^\s*)#+.+/m,lookbehind:!0,alias:"important",inside:{punctuation:/^#+|#+$/}}],hr:{pattern:/(^\s*)([*-])([\t ]*\2){2,}(?=\s*$)/m,lookbehind:!0,alias:"punctuation"},list:{pattern:/(^\s*)(?:[*+-]|\d+\.)(?=[\t ].)/m,lookbehind:!0,alias:"punctuation"},"url-reference":{pattern:/!?\[[^\]]+\]:[\t ]+(?:\S+|<(?:\\.|[^>\\])+>)(?:[\t ]+(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\)))?/,inside:{variable:{pattern:/^(!?\[)[^\]]+/,lookbehind:!0},string:/(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\))$/,punctuation:/^[\[\]!:]|[<>]/},alias:"url"},bold:{pattern:/(^|[^\\])(\*\*|__)(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/,lookbehind:!0,inside:{punctuation:/^\*\*|^__|\*\*$|__$/}},italic:{pattern:/(^|[^\\])([*_])(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/,lookbehind:!0,inside:{punctuation:/^[*_]|[*_]$/}},url:{pattern:/!?\[[^\]]+\](?:\([^\s)]+(?:[\t ]+"(?:\\.|[^"\\])*")?\)| ?\[[^\]\n]*\])/,inside:{variable:{pattern:/(!?\[)[^\]]+(?=\]$)/,lookbehind:!0},string:{pattern:/"(?:\\.|[^"\\])*"(?=\)$)/}}}}),Prism.languages.markdown.bold.inside.url=Prism.util.clone(Prism.languages.markdown.url),Prism.languages.markdown.italic.inside.url=Prism.util.clone(Prism.languages.markdown.url),Prism.languages.markdown.bold.inside.italic=Prism.util.clone(Prism.languages.markdown.italic),Prism.languages.markdown.italic.inside.bold=Prism.util.clone(Prism.languages.markdown.bold);

/**
 * Define a decorator for markdown styles.
 *
 * @param {Text} text
 * @param {Block} block
 */

function markdownDecorator(text, block) {
  const characters = text.characters.asMutable()
  const language = 'markdown'
  const string = text.text
  const grammar = Prism.languages[language]
  const tokens = Prism.tokenize(string, grammar)
  addMarks(characters, tokens, 0)
  return characters.asImmutable()
}

function codeH(text, block){
  console.log('text',text)
  console.log('block',block)
  const characters = text.characters.asMutable()
  return characters.asImmutable()
}

function CodeBlock(props) {
  console.log('block')
  const { editor, node } = props
  const language = 'javascript'

  function onChange(e) {
    const state = editor.getState()
    const next = state
      .transform()
      .setNodeByKey(node.key, {
        data: {
          language: e.target.value
        }
      })
      .apply()
    editor.onChange(next)
  }
}

function addMarks(characters, tokens, offset) {
  // console.log('char',characters)
  // console.log('token',tokens)
  // console.log('offset',offset)
  for (const token of tokens) {
    if (typeof token == 'string') {
      offset += token.length
      continue
    }

    const { content, length, type } = token
    const mark = Mark.create({ type })

    for (let i = offset; i < offset + length; i++) {
      let char = characters.get(i)
      let { marks } = char
      marks = marks.add(mark)
      char = char.set('marks', marks)
      characters.set(i, char)
    }

    if (Array.isArray(content)) {
      addMarks(characters, content, offset)
    }

    offset += length
  }
}

/**
 * Define a schema.
 *
 * @type {Object}
 */

const schema = {
  nodes: {
  }
  ,
  marks: {
    'title': {
      fontWeight: 'bold',
      fontSize: '18px',
      margin: '0 0 8px 0',
      display: 'inline-block',
      color: "#569CD6"
    },
    'bold': {
      fontWeight: 'bold',
      color: "#569CD6"
    },
    'italic': {
      fontStyle: 'italic'
    },
    'punctuation': {
      opacity: 0.6
    },
    'code': {
      fontFamily: 'monospace',
      display: 'inline-block',
      padding: '2px 1px',
      color: '#CE915E',
      direction: 'ltr'
    },
    'list': {
      paddingLeft: '5px',
      lineHeight: '16px',
      color: "#569CD6"
    },
    'hr': {
      
      display: 'block',
      opacity: 0.5,
    }
  },
  rules: [
    {
      match: () => true,
      decorate: markdownDecorator

    }
  ],
    
  
}

/**
 * The markdown preview example.
 *
 * @type {Component}
 */

class MarkdownPreview extends React.Component {

  /**
   * Deserialize the initial editor state.
   *
   * @type {Object}
   */
  constructor() {
    super()
    this.state = {state: DocStore.getContent()}
  }

  componentWillMount() {
    DocStore.on("content update", (state)=>{
      this.setState({state})
    });
  }


  style = {
    backgroundColor: '#1E1E1E',
    color: '#D4D4D4'
  }

  /**
   *
   * Render the example.
   *
   * @return {Component} component
   */

  render() {
    return (
      <div style = {this.style}>
        <p style={{textAlign:'center'}}>{DocStore.fileName}</p>
        <Editor
          schema={schema}
          state={this.state.state}
          onChange={this.onChange.bind(this)}
        />
      </div>
    )
  }

  /**
   * On change.
   *
   * @param {State} state
   */

  onChange = (state) => {
     //this.setState({ state })
    dispatcher.dispatch({
      type: "UPDATE_CONTENT",
      state,
    });
  }

}

/**
 * Export.
 */

export default MarkdownPreview