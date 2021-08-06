<template>
  <div class="hello">
    <div>
      <b-alert
        variant="success"
        dismissible
        fade
        v-model="showSuccessAlert"
      >
        Merging of files was a success!
      </b-alert>  
      <b-alert
        variant="danger"
        dismissible
        fade
        v-model="showErrorAlert"
      >
        Merging of files was a failure! Please try again
      </b-alert>
    </div>

    <div>
      <b-form @submit.prevent="mergeFiles">
        <b-form-file multiple v-model="jsonfile" enctype="multipart/form-data">
          <template slot="file-name" slot-scope="{ names }" accept="file/*">
            <b-badge variant="dark">{{ names[0] }}</b-badge>
            <b-badge v-if="names.length > 1" variant="dark" class="ml-1">
              + {{ names.length - 1 }} More files
            </b-badge>
          </template>
        </b-form-file>

        <div class="spinner">
          <b-button type="submit" variant="success" v-if="loading" block>Merge files</b-button>
          <b-button type="submit" variant="success" v-if="!loading" disabled>
            <b-spinner small type="grow"></b-spinner>
            Loading...
          </b-button>
        </div>
      </b-form>
    </div>

  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: "HelloWorld",
  data () {
    return {
      loading: false,
      jsonfile: [],
      showSuccessAlert: false,
      shoeErrorAlert: false
    }
  },
  methods: {
    async mergeFiles () {
      const payload = new FormData()
      for (const file of this.jsonfile) {
        payload.append('jsonfile', file, file.name)
      }
      this.loading = true
      try {
        await axios.post('http://localhost:5000', payload)
        this.loading = false
        this.jsonfile = []
        this.showSuccessAlert = true
        this.shoeErrorAlert = false
      } catch (error) {
        this.loading = false
        this.jsonfile = []
        this.showSuccessAlert = true
        this.shoeErrorAlert = false
        console.log(error)
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hello{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 100px;
}
.spinner{
  margin-top: 30px;
}
</style>
