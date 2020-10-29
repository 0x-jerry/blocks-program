import './styles.less'
import Area from './Area.vue'
import Block from './Block.vue'
import BlockConnection from './BlockConnection.vue'
import BlockDropdown from './BlockDropdownField.vue'
import BlockInput from './BlockInputField.vue'
import BlockMulti from './BlockMultiField.vue'
import Workspace from './Workspace.vue'

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
        {Object.keys(Comp).map((t) => (
          <button onClick={() => switchPlayground(t)}>{t}</button>
        ))}
      </div>
      <div class='test'>{Comp[data.type]}</div>
    </div>
  )
})
