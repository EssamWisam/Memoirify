import {
  DiffSourceToggleWrapper,
  MDXEditor,
  corePluginHooks,
  diffSourcePlugin,
  headingsPlugin,
  toolbarPlugin,
} from '@mdxeditor/editor'
import { $patchStyleText } from '@lexical/selection'

const markdownWithSpan = `
  # Hello World

  A paragraph with <span style="color: red" class="some">some red text <span style="color: blue">with some blue nesting.</span> in here.</span> in it.
`

export default function App() {
  return (
    <>
      <MDXEditor
        markdown={markdownWithSpan}
        plugins={[
          headingsPlugin(),
          diffSourcePlugin(),
          toolbarPlugin({
            toolbarContents: () => (
              <DiffSourceToggleWrapper>
                <HTMLToolbarComponent />
              </DiffSourceToggleWrapper>
            )
          })
        ]}
        onChange={(md) => {
          //console.log('change', md)
        }}
      />
    </>
  )
}

const HTMLToolbarComponent = () => {
  const [currentSelection, activeEditor] = corePluginHooks.useEmitterValues('currentSelection', 'activeEditor')
 
  
  return (
    <>
      <button
        onClick={() => {
          if (activeEditor !== null && currentSelection !== null) {
            activeEditor.update(() => {
              try {
              $patchStyleText(currentSelection, { color: 'orange' })
              }
              catch (e) {
                console.log(e)
              }
            })
          }
        }}
      >
        Make selection orange
      </button>

    </>
  )
}