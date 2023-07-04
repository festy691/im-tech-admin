<template>
  <div class="text-start">
    <v-btn
        color="orange"
        variant="text"
        size="small"
        v-bind="attrs"
        v-on="on">
        Update rate

        <v-dialog
            v-model="dialog"
            width="600"
            activator="parent"
          >
          <template v-slot:activator="{ on, attrs }">
            
          </template>

          <v-card class="pa-8">
            <v-form
                ref="form"
                v-model="valid"
                lazy-validation>

              <v-row class="py-6">

                <v-col cols="12" md="6">
                  <v-text-field
                      label="Rate"
                      placeholder="Rate"
                      v-model="item.rate"
                      required
                      variant="outlined">
                  </v-text-field>
                </v-col>

              </v-row>

              <center>
                <v-btn depressed class="text-white ma-4" color="blue" :loading="isLoading" @click="updateProduct">Update rate</v-btn>
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
  name: "UpdateRate",

  props: {
    item: Object,
  },

  data () {
    return {
      snackbar: false,
      text: ``,
      valid: true,
      dialog: false,
      isLoading: false,
      selectedCategoryName: null,
      selectedCategoryId: null,
      selectedCountryName: null,
      selectedCountryId: null,
      categoryNames: [],
      countryNames: [],
    }
  },

  created() {

  },

  methods: {
    async updateProduct(){
      let self = this;
      let form = new FormData();

      let requestData = {
        "rate": self.item.rate
      };


      let http = new APIRequest();
      self.isLoading = true;
      let url = `${http.baseUrl}/rates/${self.item._id}`;
      http.put(url, requestData, (err,data)=> {
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
        this.emitter.emit("update-rate", data);
        self.snackbar = true;
      });
    },

  },
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