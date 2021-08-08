<template>
  <div class="hello">
    <div>
      <b-alert variant="success" dismissible fade v-model="showSuccessAlert">
        Merging of files was a success!
      </b-alert>
      <b-alert variant="danger" dismissible fade v-model="showErrorAlert">
        Merging of files was a failure! Please try again
      </b-alert>
    </div>

    <div>
      <b-form @submit.prevent="mergeFiles" enctype="multipart/form-data">
        <b-form-file
          multiple
          name="jsonfile"
          @change="uploadFile"
          accept="file/*"
          required
          >
          <template slot="file-name" slot-scope="{ names }">
            <b-badge variant="dark">{{ names[0] }}</b-badge>
            <b-badge v-if="names.length > 1" variant="dark" class="ml-1">
              + {{ names.length - 1 }} More files
            </b-badge>
          </template>
        </b-form-file>

        <div class="spinner">
          <b-button type="submit" variant="success" v-if="!loading" block>
            Merge files
          </b-button>
          <b-button
            type="submit"
            variant="success"
            v-if="loading"
            disabled
            block
          >
            <b-spinner small type="grow"></b-spinner>
            Loading...
          </b-button>
        </div>
      </b-form>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "HelloWorld",
  data() {
    return {
      loading: false,
      jsonfile: [],
      showSuccessAlert: false,
      showErrorAlert: false,
    };
  },
  methods: {
    uploadFile(event) {
      this.jsonfile = event.target.files;
    },

    async mergeFiles() {
      const payload = new FormData();
      let i = 0;
      for (const file of this.jsonfile) {
        i += 1;
        payload.append(`file[${i}]`, file);
      }
      this.loading = true;
      try {
        await axios({
          url: "http://localhost:3000",
          method: "POST",
          data: payload,
          headers: { "Content-Type": "multipart/form-data"}
        });
        this.loading = false;
        this.showSuccessAlert = true;
        this.showErrorAlert = false;
        this.jsonfile = [];
        console.log(payload);
      } catch (error) {
        this.loading = false;
        this.jsonfile = [];
        this.showSuccessAlert = false;
        this.showErrorAlert = true;
        console.log(error);
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hello {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 100px;
}
.spinner {
  margin-top: 30px;
}
</style>
