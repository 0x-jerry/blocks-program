import { defineComponent, onMounted, reactive } from 'vue'
import { uuid } from '../src/shared'

export default (onRendered: (el: HTMLDivElement) => void, name = 'BlockProgram') =>
  defineComponent({
    name,
    setup() {
      const data = reactive({
        id: uuid()
      })

      onMounted(() => {
        const el = document.getElementById(data.id) as HTMLDivElement

        onRendered(el)
      })

      return () => <div id={data.id}></div>
    }
  })
