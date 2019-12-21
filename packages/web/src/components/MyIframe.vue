<template lang="pug">
iframe(:srcdoc="html" frameborder="0")
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'

@Component
export default class MyIframe extends Vue {
  @Prop({ default: '' }) html!: string
}
</script>

<style lang="scss">
iframe {
  margin: 0;
  padding: 1em;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
