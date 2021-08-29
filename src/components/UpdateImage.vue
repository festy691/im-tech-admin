<template>
  <div class="text-start">
    <v-dialog
        v-model="dialog"
        width="800">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
            depressed
            class="transparent amber--text"
            light
            v-bind="attrs"
            v-on="on">
          Edit
        </v-btn>
      </template>

      <v-card class="pa-8">
        <v-card-title class="body-1 grey lighten-2 justify-space-around">
          <center>
            <v-icon x-large class="blue--text">mdi-cloud-upload</v-icon>
            <p><v-btn depressed color="black--text grey lighten-2" :loading="isSelecting" @click="pickFile()">Upload Image</v-btn></p>
          </center>
          <input
              ref="filebtn"
              class="filebtn"
              type="file"
              v-on:change="onFileChanged" />
        </v-card-title>

        <v-card-text>
          <v-list subheader two-line>

            <v-list-item
                v-for="(image, key) in images"
                :key="key"
            >
              <v-list-item-avatar>
                <v-img :src="image.src"></v-img>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title v-text="image.file.name"></v-list-item-title>
              </v-list-item-content>

              <v-list-item-action>
                <v-btn icon @click="removeFile(key)">
                  <v-icon color="red--text">mdi-close</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>

          </v-list>
        </v-card-text>

        <v-divider></v-divider>

        <center>
          <v-btn class="amber darken-2 ma-4" :loading="isLoading" @click="uploadImage">Update Image</v-btn>
        </center>

      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar">
      {{ text }}
      <template v-slot:action="{ attrs }">
        <v-btn
            color="pink"
            text
            v-bind="attrs"
            @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import {APIRequest} from "../js/APIRequest";

export default {
  name: "UpdateImage",
  props: {
    id: String,
  },
  data () {
    return {
      snackbar: false,
      text: ``,
      dialog: false,
      images: [],
      isLoading: false,
      selectedFile: null,
      isSelecting: false,
    }
  },
  created() {

  },
  methods: {
    pickFile() {
      if(this.images.length > 0){
        return;
      }
      this.isSelecting = true
      window.addEventListener('focus', () => {
        this.isSelecting = false
      }, { once: true })

      this.$refs.filebtn.click()
    },
    onFileChanged(e) {
      this.selectedFile = e.target.files[0];
      this.previewFile(this.selectedFile, (src)=>{
        this.images.push({"file":this.selectedFile, "src":src});
      });
    },
    removeFile(index){
      this.images.splice(index, 1);
    },
    previewFile: function (image, callback) {
      const file = image;
      const reader = new FileReader();

      reader.addEventListener("load", function () {
        // convert image file to base64 string
        let src = reader.result;
        callback(src);
      }, false);

      if (file) {
        reader.readAsDataURL(file);
      }
    },
    uploadImage(){
      let self = this;
      let form = new FormData();

      if(self.images[0]) {
        form.append('image',self.images[0].file);
      }
      else {
        self.text = 'Select Image to Upload';
        self.snackbar = true;
        return;
      }

      let http = new APIRequest();
      self.isLoading = true;
      let url = `https://dave-inventory.herokuapp.com/api/v1/images`;
      http.postForm(url, form, (err,data)=> {
        if(err) {
          self.isLoading = false;
          console.log(err);
          self.text = err.error;
          self.snackbar = true;
          return;
        }
        self.update(data.image);
      });
    },
    update(image){
      let self = this;
      let detail = {
        "image":image,
      };
      let http = new APIRequest();
      self.isLoading = true;
      let url = `https://dave-inventory.herokuapp.com/api/v1/users/updatepics/${self.id}`;
      http.put(url, detail, (err,data)=> {
        if (err) {
          if (err.error.message){
            self.text = err.error.message;

            self.isLoading = false;
            self.snackbar = true;
            console.log(err.error.message);
            return;
          }
          self.text = err.error;

          self.isLoading = false;
          self.snackbar = true;
          console.log(err);
          return;
        }
        console.log(data);
        self.text = data.success;

        self.isLoading = false;
        self.snackbar = true;
        self.$emit('updated');

      });
    },
  }
}
</script>

<style scoped>

</style>