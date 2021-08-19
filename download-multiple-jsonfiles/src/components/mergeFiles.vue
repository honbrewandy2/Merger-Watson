<template>
  <div class="hello">
    <h6>
      <strong>Insert multiple JSON files to merge and download after</strong>
    </h6>
    <br />
    <div>
      <b-alert variant="success" dismissible fade v-model="showSuccessAlert">
        Merging of files was a success!
      </b-alert>
      <b-alert variant="danger" dismissible fade v-model="showErrorAlert">
        Invalid JSON File! Please try again
      </b-alert>
    </div>
    <div>
      <b-form @submit.prevent="onSubmit" enctype="multipart/form-data">
        <b-form-file
          multiple
          v-model="jsonfiles"
          accept="file/*"
          required
          ref="jsonfiles"
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
            Merge & Download Files
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
export default {
  name: "mergeFiles",
  data() {
    return {
      loading: false,
      jsonfiles: [],
      showSuccessAlert: false,
      showErrorAlert: false,
    };
  },
  methods: {
    onSubmit() {
      let finaljson = [];
      // Check HTML5 File API Browser Support
      if (window.File && window.FileList && window.FileReader) {
        const filelist = [];
        for (let file of this.$refs.jsonfiles.files) {
          const readfiles = () => {
            return new Promise((resolve, reject) => {
              let reader = new FileReader();
              reader.readAsText(file);

              reader.onload = function (e) {
                try {
                  finaljson.push(JSON.parse(e.target.result));
                  resolve(finaljson);
                  console.log("onload:::", JSON.parse(e.target.result));
                } catch (error) {
                  console.error("onerror:::", e.target.error);
                  reject(finaljson);
                }
              };
            });
          };
          filelist.push(readfiles());
        }

        Promise.all(filelist)
          .then((b) => {
            const mergedfiles = [...new Set([...finaljson])];
            const FileSaver = require("file-saver");
            const downloadfiles = new File(
              [JSON.stringify(mergedfiles)],
              "merged-files.json",
              { type: "application/json; utf-8" }
            );
            FileSaver.saveAs(downloadfiles);
            this.showSuccessAlert = true;
            this.jsonfiles = [];
            console.log(b);
          })
          .catch((e) => {
            console.log(e);
            this.showErrorAlert = true;
            this.jsonfiles = [];
          });

        console.log("fileLIst here::::", filelist);
        console.log("fileList:::", filelist);
      } else {
        alert("Your browser is too old to support HTML5 File API");
      }
    },
  },
};
</script>

<style scoped>
.hello {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 100px;
  font-family: Poppins, sans-serif;
}
.spinner {
  margin-top: 30px;
}
</style>
