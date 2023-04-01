<script lang="ts">
import Button from 'primevue/button'
export default {
  components: {
    Button
  },
  data() {
    return {
      users: []
    }
  },
  methods: {
    print() {
      console.log(this.users)
      const dom = this.$refs.prescription
      const win = window.open('')
      win.document.write(dom.outerHTML)
      dom.print()
      win.close()
    }
  }
}
</script>

<template>
  <div>
    <h1 ref="prescription">home</h1>
    <Button label="打印" @click="print" />
  </div>
</template>
