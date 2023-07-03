<template>
  <div class="text-start">

    <v-btn
        color="green"
        text
        v-bind="attrs"
        v-on="on">
        Add New

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
                      label="Product Name"
                      placeholder="Name"
                      v-model="item.name"
                      variant="outlined"
                      required
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                      label="Physical Card Rate"
                      placeholder="Buy Price Physical"
                      v-model="item.ratePhysical"
                      required
                      variant="outlined">
                  </v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                      label="E-Code Card Rate"
                      placeholder="Buy Price E-Code"
                      v-model="item.rateECode"
                      required
                      variant="outlined">
                  </v-text-field>
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
  name: "AddGiftcard",

  props: {
    country: String
  },

  data () {
    return {
      snackbar: false,
      text: ``,
      valid: true,
      dialog: false,
      isLoading: false,
      categories: [],
      countries: [],
      selectedCategoryName: null,
      selectedCountryName: null,
      categoryNames: [],
      countryNames: [],
      item: {
        name: null,
        country: null,
        sellPriceNaira: null,
        sellPriceDollar: null,
        buyPriceNaira: null,
        buyPriceDollar: null
      }
    }
  },

  created() {
    
  },

  methods: {
    async addProduct(){
      let self = this;
      let form = new FormData();

      form.append('name',self.item.name);
      form.append('country', self.country);
      form.append('ratePhysical',self.item.ratePhysical);
      form.append('rateECode',self.item.rateECode);

      let http = new APIRequest();
      self.isLoading = true;
      let url = `${http.baseUrl}/giftcards`;
      http.postForm(url, form, (err,data)=> {
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
        this.emitter.emit("update-giftcard", data);
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