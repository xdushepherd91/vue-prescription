<script lang="ts">
import Button from 'primevue/button'
export default {
  data() {
    return {
      count: 0
    }
  },
  methods: {
    print() {
      const dom = this.$refs.prescription
      const win = window.open('')
      console.log(dom)
      win.document.write(dom.outerHTML)
      win.print()
      win.close()
    }
  }
}
</script>

<template>
  <div>
    <h1 ref="prescription">home</h1>
    <Button label="Submit" @click="print" />
  </div>
</template>
