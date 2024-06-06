import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import { EditorProvider, useCurrentEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React,{useState}from 'react'
import {useDebounce} from 'react-use';

const MenuBar = () => {
  const { editor } = useCurrentEditor()

  if (!editor) {
    return null
  }

  return (
    <div className='flex gap-2 flex-wrap w-full items-center tiptapmenu'>
      <button
        onClick={(e) =>{e.preventDefault(); editor.chain().focus().toggleBold().run()}}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .toggleBold()
            .run()
        }
        className={editor.isActive('bold') ? 'bg-teal-100  p-2' : ' p-2'}
      >
        bold
      </button>
      <button
        onClick={(e) =>{e.preventDefault(); editor.chain().focus().toggleItalic().run()}}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .toggleItalic()
            .run()
        }
        className={editor.isActive('italic') ? 'bg-teal-100  p-2' : ' p-2'}
      >
        italic
      </button>
      <button
        onClick={(e) =>{e.preventDefault(); editor.chain().focus().toggleStrike().run()}}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .toggleStrike()
            .run()
        }
        className={editor.isActive('strike') ? 'bg-teal-100  p-2' : ' p-2'}
      >
        strike
      </button>
      <button
        onClick={(e) =>{e.preventDefault(); editor.chain().focus().toggleCode().run()}}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .toggleCode()
            .run()
        }
        className={editor.isActive('code') ? 'bg-teal-100  p-2' : ' p-2'}
      >
        code
      </button>
      <button
        onClick={(e) =>{e.preventDefault(); editor.chain().focus().setParagraph().run()}}
        className={editor.isActive('paragraph') ? 'bg-teal-100  p-2' : ' p-2'}
      >
        paragraph
      </button>
      <button
        onClick={(e) =>{e.preventDefault(); editor.chain().focus().toggleHeading({ level: 1 }).run()}}
        className={editor.isActive('heading', { level: 1 }) ? 'bg-teal-100  p-2' : ' p-2'}
      >
        h1
      </button>
      <button
        onClick={(e) =>{e.preventDefault(); editor.chain().focus().toggleHeading({ level: 2 }).run()}}
        className={editor.isActive('heading', { level: 2 }) ? 'bg-teal-100  p-2' : ' p-2'}
      >
        h2
      </button>
      <button
        onClick={(e) =>{e.preventDefault(); editor.chain().focus().toggleHeading({ level: 3 }).run()}}
        className={editor.isActive('heading', { level: 3 }) ? 'bg-teal-100  p-2' : ' p-2'}
      >
        h3
      </button>
      <button
        onClick={(e) =>{e.preventDefault(); editor.chain().focus().toggleHeading({ level: 4 }).run()}}
        className={editor.isActive('heading', { level: 4 }) ? 'bg-teal-100  p-2' : ' p-2'}
      >
        h4
      </button>
      <button
        onClick={(e) =>{e.preventDefault(); editor.chain().focus().toggleHeading({ level: 5 }).run()}}
        className={editor.isActive('heading', { level: 5 }) ? 'bg-teal-100  p-2' : ' p-2'}
      >
        h5
      </button>
      <button
        onClick={(e) =>{e.preventDefault(); editor.chain().focus().toggleHeading({ level: 6 }).run()}}
        className={editor.isActive('heading', { level: 6 }) ? 'bg-teal-100  p-2' : ' p-2'}
      >
        h6
      </button>
      <button
        onClick={(e) =>{e.preventDefault(); editor.chain().focus().toggleBulletList().run()}}
        className={editor.isActive('bulletList') ? 'bg-teal-100  p-2' : ' p-2'}
      >
        bullet list
      </button>
      <button
        onClick={(e) =>{e.preventDefault(); editor.chain().focus().toggleOrderedList().run()}}
        className={editor.isActive('orderedList') ? 'bg-teal-100  p-2' : ' p-2'}
      >
        ordered list
      </button>
      <button
        onClick={(e) =>{e.preventDefault(); editor.chain().focus().toggleCodeBlock().run()}}
        className={editor.isActive('codeBlock') ? 'bg-teal-100  p-2' : ' p-2'}
      >
        code block
      </button>
      <button
        onClick={(e) =>{e.preventDefault(); editor.chain().focus().toggleBlockquote().run()}}
        className={editor.isActive('blockquote') ? 'bg-teal-100  p-2' : ' p-2'}
      >
        blockquote
      </button>
      <button onClick={(e) =>{e.preventDefault(); editor.chain().focus().setHorizontalRule().run()}}>
        horizontal rule
      </button>
      <button
        onClick={(e) =>{e.preventDefault(); editor.chain().focus().undo().run()}}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .undo()
            .run()
        }
      >
        undo
      </button>
      <button
        onClick={(e) =>{e.preventDefault(); editor.chain().focus().redo().run()}}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .redo()
            .run()
        }
      >
        redo
      </button>
      <button
        onClick={(e) =>{e.preventDefault(); editor.chain().focus().setColor('#958DF1').run()}}
        className={editor.isActive('textStyle', { color: '#958DF1' }) ? 'bg-teal-100  p-2' : ' p-2'}
      >
        purple
      </button>
    </div>
  )
}

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  // @ts-ignore
  TextStyle.configure({ types: [ListItem.name] }),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
  }),
]



const Editor: React.FC<any> = (props) => {
  const { editor } = useCurrentEditor();
  const [editorHTML,setEditorHTML] = useState("");


  useDebounce(
    () => {
      if(editorHTML){
        props.onChange(editorHTML);
      }
  },500,[editorHTML]);

  const content = props?.content
  return (
    <div className='my-4 flex flex-col p-2 border rounded-sm bg-white'>
      <EditorProvider slotBefore={<MenuBar />} extensions={extensions} content={content} onUpdate= {({ editor }) => {setEditorHTML(editor?.getHTML());}} >

      </EditorProvider>
    </div>
  )
}

export default Editor;