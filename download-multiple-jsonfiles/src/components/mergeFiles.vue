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
      <b-form @submit.prevent="readFile" enctype="multipart/form-data">
        <b-form-file
          multiple
          name="jsonfile"
          
          accept="file/*"
          required
          ref="file"
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
export default {
  name: "mergeFiles",
  data() {
    return {
      loading: false,
      jsonfile: [],
      showSuccessAlert: false,
      showErrorAlert: false,
    };
  },
  methods: {
    readFile (event) {
      // Check HTML5 File API Browser Support
      if (window.File && window.FileList && window.FileReader) {       
        const fileinput = event.target.files;
        const filelist = [];
        for (let  i = 0;  i < fileinput.length; i++) {
          const files = fileinput[i]
          const reader = new FileReader();
          
            reader.onload = function() {
              filelist.push(JSON.parse(reader.result));
              this.showSuccessAlert = true;
            }
            reader.onerror = function() {
              (reader);
              this.showErrorAlert = true
            }
                        
          
          reader.readAsArrayBuffer(files);
           
        
        }
        const sendJson = JSON.stringify()
       if(sendJson && typeof sendJson === "object") {
          const FileSaver = require('file-saver');
          const mergedfiles = new File([sendJson], "result.json", {
            type: "application/json; utf-8"
          })
          FileSaver.saveAs(mergedfiles)
          console.log('response data?', sendJson)
          
        }

                
      } else {
        alert("Your browser is too old to support HTML5 File API");
      }
    }
  }
}
</script>

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