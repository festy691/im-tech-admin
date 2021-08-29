<template>
  <v-col cols="auto">
    <v-dialog
        transition="dialog-top-transition"
        max-width="700"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
            class="white blue--text"
            v-bind="attrs"
            v-on="on"
            depressed
            autocapitalize="none"
            min-width="200px">
          <v-icon>mdi-cart-plus</v-icon>
          <v-spacer></v-spacer>
          Record Sale
        </v-btn>
      </template>
      <template v-slot:default="dialog">
        <v-card>
          <v-toolbar
              color="white"
          >Record Sale</v-toolbar>

          <div class="pa-4">
            <v-form v-model="valid">
              <v-container>
                <v-row>
                  <v-col
                      cols="12"
                      md="6"
                  >
                    <v-autocomplete
                        v-model="model"
                        :items="items"
                        :loading="isLoading"
                        :search-input.sync="search"
                        clearable
                        hide-details
                        hide-selected
                        item-text="name"
                        item-value="_id"
                        label="Search for a item..."
                        solo
                    >
                      <template v-slot:item="{ item }">
                        <v-list-item-avatar
                            color="indigo"
                            class="headline font-weight-light white--text"
                        >
                          {{ item.name.charAt(0) }}
                        </v-list-item-avatar>
                        <v-list-item-content>
                          <v-list-item-title v-text="item.name"></v-list-item-title>
                          <v-list-item-subtitle v-text="item.brand"></v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-icon>mdi-bitcoin</v-icon>
                        </v-list-item-action>
                      </template>
                    </v-autocomplete>
                  </v-col>

                  <v-col
                      cols="12"
                      md="6"
                  >
                    <v-text-field
                        v-model="quantity"
                        label="Quantity"
                        required
                    ></v-text-field>
                  </v-col>

                  <v-col
                      cols="12"
                      md="6"
                  >
                    <v-text-field
                        v-model="name"
                        label="Customer Name"
                        required
                        :counter="30"
                        :rules="nameRules"
                    ></v-text-field>
                  </v-col>

                  <v-col
                      cols="12"
                      md="6"
                  >
                    <v-text-field
                        v-model="price"
                        label="Total Price"
                        disabled
                    ></v-text-field>
                  </v-col>

                </v-row>
              </v-container>
            </v-form>
          </div>
          <center class="mx-8"><v-btn class="blue darken-2 pa-4 white--text" :loading="isLoading" @click="addSale">Add Record</v-btn></center>
          <v-card-actions class="justify-end">
            <v-btn
                text
                @click="dialog.value = false"
            >Close</v-btn>
          </v-card-actions>
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
      </template>
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
  </v-col>
</template>

<script>
import {APIRequest} from "../js/APIRequest";

export default {
  name: "Record-Sale",
  data() {
    return{
      items: [],
      model: null,
      search: null,
      isLoading: false,
      valid: false,
      name: '',
      price: null,
      quantity: null,
      nameRules: [
        v => !!v || 'Name is required',
        v => v.length <= 30 || 'Name must be less than or equal to 30 characters',
      ],
      email: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid',
      ],
      snackbar: false,
      text: ``,
    }
  },
  created() {
    if (sessionStorage.getItem("login") !== null){
      this.$router.push('/');
    }
  },
  methods: {
    getStock(){
      let self = this;
      let http = new APIRequest();
      self.isLoading = true;
      let url = `https://dave-inventory.herokuapp.com/api/v1/products`;
      http.get(url, (err,data)=> {
        if (err) {
          self.text = err.error;

          self.isLoading = false;
          self.snackbar = true;
          return;
        }

        self.items = data;

        self.isLoading = false;

      });
    },
    addSale(){

      let self = this;
      self.price = self.model.price * self.quantity;
      console.log(self.model);
      let detail = {
        "customer":self.name,
        "product":self.model,
        "agent":sessionStorage.getItem('userId'),
        "quantity":self.quantity,
      };
      let http = new APIRequest();
      self.isLoading = true;
      let url = `https://dave-inventory.herokuapp.com/api/v1/sales`;
      http.post(url, detail, (err,data)=> {
        if (err) {
          self.text = err.error;

          self.isLoading = false;
          console.log(err.error);
          self.snackbar = true;
          return;
        }

        self.text = data.success;

        self.isLoading = false;
        self.snackbar = true;

      });
    },
  },
  watch: {
    model (val) {
      if (val != null) this.tab = 0
      else this.tab = null
    },
    search (val) {
      // Items have already been loaded
      console.log(val);
      if (this.items.length > 0) return

      this.isLoading = true

      // Lazily load input items
      fetch('https://dave-inventory.herokuapp.com/api/v1/products')
          .then(res => res.clone().json())
          .then(res => {
            this.items = res
          })
          .catch(err => {
            console.log(err)
          })
          .finally(() => (this.isLoading = false))
    },
  },
}
</script>

<style scoped>

</style>