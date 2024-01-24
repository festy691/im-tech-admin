<template>
    <div class="text-start">
        <v-btn
            color="primary" 
            variant="flat" 
            class="mx-12 text-white"
            v-bind="attrs"
            size="small"
            v-on="on">
            Update received value
  
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
  
                <v-card-text v-else-if="item.receivedReceipt !== null">
                  <v-list subheader two-line>
  
                    <v-list-item>
                      <template v-slot:prepend>
                        <v-avatar size="24">
                          <v-img :src="item.receivedReceipt"></v-img>
                        </v-avatar>
                      </template>
                    </v-list-item>
  
                  </v-list>
                </v-card-text>
  
                <v-divider></v-divider>
  
                <v-row class="py-6">
                  <v-col cols="12" md="12">
                    <v-text-field
                        label="Amount received"
                        placeholder="100"
                        v-model="item.priceReceived"
                        variant="outlined"
                        required
                    ></v-text-field>
                  </v-col>
                </v-row>
  
                <center>
                  <v-btn depressed class="text-white ma-4" color="blue" :loading="isLoading" @click="updateReceipt">Update receipt</v-btn>
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
    name: "UpdateReceipt",
  
    props: {
      item: Object
    },
  
    data () {
      return {
        snackbar: false,
        text: ``,
        valid: true,
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
  
      async updateReceipt(){
        let self = this;
        let form = new FormData();
  
        form.append('priceReceived', Number(self.item.priceReceived));
        if(self.image) form.append('image', self.image.file);
  
        let http = new APIRequest();
        self.isLoading = true;
        let url = `${http.baseUrl}/orders/confirm-receipt/${self.item._id}`;
        http.putForm(url, form, (err,data)=> {
          if(err != null) {
            self.isLoading = false;
            self.text = err.message == null ? err : err.message;
            self.snackbar = true;
            return;
          }
          self.isLoading = false;
          self.text = data.success;
          this.emitter.emit("update_crypto_order", data);
          self.snackbar = true;
          self.dialog = false;
        });
      },
  
    },
  
    created() {
  
    }
  }
  </script>
  
  <style lang="scss" scoped>
  .v-input {
    ::v-deep div.v-input__control {
      div.v-input__slot {
        margin-top: 4px;
        margin-bottom: 0 !important;
      }
      div.v-messages {
        display: none;
      }
    }
  }
  input.filebtn {
    display: none;
  }
  .v-chip.not-selected {
    background: #E0E0E0;
  }
  .v-chip.selected {
    background: #BDBDBD;
  }
  </style>