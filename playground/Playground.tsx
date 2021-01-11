import './styles.less'
import Area from './Area'
import Block from './Block'
import BlockConnection from './BlockConnection'
import BlockDropdown from './BlockDropdownField'
import BlockInput from './BlockInputField'
import BlockMulti from './BlockMultiField'
import Workspace from './Workspace'

import { defineComponent, reactive } from 'vue'

export const Playground = defineComponent(() => {
  const data = reactive({
    type: 'area'
  })

  const switchPlayground = (type: string) => {
    data.type = type
  }

  const Comp = {
    area: <Area />,
    block: <Block />,
    blockConnection: <BlockConnection />,
    blockDropdown: <BlockDropdown />,
    blockInput: <BlockInput />,
    blockMulti: <BlockMulti />,
    workspace: <Workspace />
  }

  return () => (
    <div class='playground'>
      <div class='toolbar'>
        {import.meta.env.PROD && (
          <button>
            <a href='./api'> api document </a>
          </button>
        )}

        {Object.keys(Comp).map((t) => (
          <button onClick={() => switchPlayground(t)}>{t}</button>
        ))}
      </div>
      <div class='test'>{Comp[data.type]}</div>
    </div>
  )
})
