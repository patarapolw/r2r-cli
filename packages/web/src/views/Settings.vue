<template lang="pug">
.container.mt-3
  h3 Media file location
  p
    | Media files are accessible at&nbsp;
    code /media/filename.ext
  h3.mt-3.danger Reset user database
  .row
    .col-8.danger Please ensure you want to reset the database
    .col-4
      button.btn.btn-danger.form-control(@click="onResetDatabaseClicked") Reset database
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { api } from '../global'

@Component
export default class Settings extends Vue {
  mediaFolder = ''

  async onResetDatabaseClicked () {
    const r = await this.$bvModal.msgBoxConfirm(
      'Please ensure you want to reset the database. The app will restart afterwards.')

    if (r) {
      const rDelete = await fetch('/api/reset', {
        method: 'DELETE',
      })
      if (rDelete.status === 200) {
        this.$bvModal.msgBoxOk('Database is reset')
      }
    }
  }
}
</script>

<style lang="scss">
.danger {
  color: red;
}
</style>
