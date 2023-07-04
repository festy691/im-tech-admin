<template>
  <div class="text-start">
      <v-btn
          color="green"
          variant="text"
          v-bind="attrs"
          size="small"
          v-on="on">
        Add new

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
                  <v-select
                      :items="categoryNames"
                      label="Giftcard type"
                      v-model="selectedCategoryName"
                      @change="getIdCategory()"
                      variant="outlined"
                  ></v-select>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                      label="Country name"
                      placeholder="Name"
                      v-model="item.name"
                      variant="outlined"
                      required
                  ></v-text-field>
                </v-col>

              </v-row>

              <center>
                <v-btn depressed class="text-white ma-4" color="blue" :loading="isLoading" @click="addProduct">Add Item</v-btn>
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
  name: "AddCountry",

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
      selectedCategoryName: null,
      selectedCountryName: null,
      categoryNames: [],
      categories: [],
      item: {
        name: null,
        category: null,
      }
    }
  },

  methods: {

    getGiftcardCategory(){
      if(sessionStorage.getItem('login')){
        let http = new APIRequest();
        let self = this;
        let url = `${http.baseUrl}/giftcard-categories`;
        self.isLoadingCategory = true;

        http.get(url, (err,data)=> {
          if(err != null) {
            self.text = err.message == null ? err : err.message;
            self.isLoadingCategory = false;

            self.snackbar = true;
            throw err.error;
          }
          self.isLoadingCategory = false;
          self.categories = data;
          self.getNameCategory();
        });
      }
    },

    getNameCategory(){
      let self = this;
      self.categoryNames = [];
      for (let i=0; i<self.categories.length; i++){
        self.categoryNames.push(self.categories[i].name);
      }
    },

    getIdCategory(){
      let self = this;
      for (let i=0; i<self.categories.length; i++){
        if(self.selectedCategoryName === self.categories[i].name){
          self.item.category = self.categories[i]._id;
        }
      }
    },

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

      if(self.image === null){
        self.text = "Giftcard Icon is required";
        self.snackbar = true;
        return;
      }

      form.append('name',self.item.name);
      form.append('category',self.item.category);
      form.append('image', self.image.file);

      let http = new APIRequest();
      self.isLoading = true;
      let url = `${http.baseUrl}/countries`;
      http.postForm(url, form, (err,data)=> {
        if(err != null) {
          self.isLoading = false;
          self.text = err.message == null ? err : err.message;
          self.snackbar = true;
          return;
        }
        self.isLoading = false;
        self.text = data.success;
        this.emitter.emit("update_country_event", data);
        self.snackbar = true;
      });
    },

  },

  created() {
    this.getGiftcardCategory();
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