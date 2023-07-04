<template>
  <div class="text-start">
      <v-btn
          color="orange"
          variant="text"
          v-bind="attrs"
          size="small"
          v-on="on">
        Update

        <v-dialog
            v-model="dialog"
            activator="parent"
            width="500">
          <template v-slot:activator="{ on, attrs }">
            
          </template>

          <v-card class="pa-8">
            <v-form
                ref="form"
                v-model="valid"
                lazy-validation>
              <v-card-title class="justify-space-around">
                <center>
                  <v-icon size="x-large" class="text-blue">mdi-cloud-upload</v-icon>
                  <p><v-btn variant="depressed" class="text-black" color="grey lighten-2" :loading="isSelecting" @click="pickFile()">Upload Image</v-btn></p>
                </center>
                <input
                    ref="filebtn"
                    class="filebtn"
                    type="file"
                    v-on:change="onFileChanged" />
              </v-card-title>

              <v-card-text v-if="image != null">
                <v-list subheader two-line>

                  <v-list-item>
                    <template v-slot:prepend>
                      <v-avatar size="24">
                        <v-img :src="image.src"></v-img>
                      </v-avatar>
                    </template>

                    <v-list-item-title v-text="image.file.name"></v-list-item-title>

                    <template v-slot:append>
                        <v-icon class="text-red" @click="removeFile()">mdi-close</v-icon>
                    </template>
                  </v-list-item>

                </v-list>
              </v-card-text>

              <v-card-text v-else-if="item.icon !== null">
                <v-list subheader two-line>

                  <v-list-item>
                    <template v-slot:prepend>
                      <v-avatar size="24">
                        <v-img :src="item.icon"></v-img>
                      </v-avatar>
                    </template>

                    <v-list-item-title>{{item.name}}</v-list-item-title>

                  </v-list-item>

                </v-list>
              </v-card-text>

              <v-divider></v-divider>

              <v-row class="py-6">
                <v-col cols="12" md="6">
                  <v-text-field
                      label="Product Name"
                      placeholder="Name"
                      v-model="item.name"
                      variant="outlined"
                      required
                  ></v-text-field>
                </v-col>

                <v-col cols="6">
                  <v-switch
                      v-model="item.buying"
                      :label="`${item.buying ? 'Trading' : 'Not Trading'}`"
                  ></v-switch>
                </v-col>

              </v-row>

              <center>
                <v-btn depressed class="text-white ma-4" color="blue" :loading="isLoading" @click="addProduct">Update Item</v-btn>
              </center>
            </v-form>
          </v-card>

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
        </v-dialog>
      </v-btn>
  </div>
</template>

<script>
import {APIRequest} from "../js/APIRequest";

export default {
  name: "UpdateCountry",

  props: {
    item: Object
  },

  data () {
    return {
      snackbar: false,
      text: ``,
      valid: true,
      trading: true,
      dialog: false,
      image: null,
      isLoading: false,
      selectedFile: null,
      isSelecting: false,
    }
  },

  methods: {

    pickFile() {
      this.isSelecting = true
      window.addEventListener('focus', () => {
        this.isSelecting = false
      }, { once: true })

      this.$refs.filebtn.click()
    },
    reset () {
      this.$refs.form.reset()
    },
    onFileChanged(e) {
      this.selectedFile = e.target.files[0];
      this.previewFile(this.selectedFile, (src)=>{
        this.image = {
          "file": this.selectedFile,
          "src": src
        };
      });
    },
    removeFile(){
      this.image = null;
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

    async addProduct(){
      let self = this;
      let form = new FormData();

      form.append('name',self.item.name);
      form.append('buying',self.item.buying);
      if(self.image) form.append('image', self.image.file);

      let http = new APIRequest();
      self.isLoading = true;
      let url = `${http.baseUrl}/countries/${self.item._id}`;
      http.putForm(url, form, (err,data)=> {
        if(err != null) {
          self.isLoading = false;
          console.log(err);
          self.text = err.message == null ? err : err.message;
          self.snackbar = true;
          return;
        }
        console.log(data.success);
        self.isLoading = false;
        self.text = data.success;
        this.emitter.emit("update_country_event", data);
        self.snackbar = true;
      });
    },

  },
}
</script>

<style scoped>

</style>