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
          <v-icon>mdi-plus</v-icon>
          <v-spacer></v-spacer>
          Add Stock
        </v-btn>
      </template>
      <template v-slot:default="dialog">
        <v-card>
          <v-toolbar
              color="white"
          >Add New Stock</v-toolbar>

          <div class="pa-4">
            <v-form v-model="valid">
              <v-container>
                <v-row>
                  <v-col
                      cols="12"
                      md="6"
                  >
                    <v-text-field
                        v-model="name"
                        :rules="nameRules"
                        :counter="30"
                        label="Item Name"
                        required
                    ></v-text-field>
                  </v-col>

                  <v-col
                      cols="12"
                      md="6"
                  >
                    <v-text-field
                        v-model="quantity"
                        label="Available Quantity"
                        required
                    ></v-text-field>
                  </v-col>

                  <v-col
                      cols="12"
                      md="6"
                  >
                    <v-text-field
                        v-model="price"
                        label="Price"
                        required
                    ></v-text-field>
                  </v-col>

                  <v-col
                      cols="12"
                      md="6"
                  >
                    <v-text-field
                        v-model="brand"
                        label="Brand"
                        required
                    ></v-text-field>
                  </v-col>

                  <v-col
                      cols="12"
                      md="12"
                  >
                    <v-menu
                        ref="menu"
                        v-model="menu"
                        :close-on-content-click="false"
                        :return-value.sync="picker"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                            v-model="picker"
                            label="Expiry Date"
                            prepend-icon="mdi-calendar"
                            v-bind="attrs"
                            v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                          v-model="picker"
                          no-title
                          :max="end"
                          scrollable
                      >
                        <v-spacer></v-spacer>
                        <v-btn
                            text
                            color="primary"
                            @click="menu = false"
                        >
                          Cancel
                        </v-btn>
                        <v-btn
                            text
                            color="primary"
                            @click="$refs.menu.save(picker)"
                        >
                          OK
                        </v-btn>
                      </v-date-picker>
                    </v-menu>
                  </v-col>

                  <v-col
                      cols="12"
                      md="12"
                  >
                    <v-textarea
                        name="input-7-1"
                        v-model="description"
                        label="Item Description"
                        required
                    ></v-textarea>
                  </v-col>

                </v-row>
              </v-container>
            </v-form>
          </div>
          <center class="mx-8"><v-btn class="blue darken-2 pa-4 white--text" :loading="isLoading" @click="addStock">Add Item</v-btn></center>
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
  name: "Add-Stock",
  data() {
    return{
      isLoading: false,
      valid: false,
      picker: new Date().toISOString().substr(0, 10),
      name: '',
      price: null,
      brand: '',
      description: '',
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
    addStock(){
      let self = this;
      let detail = {
        "name":self.name,
        "price":self.price,
        "quantity":self.quantity,
        "brand":self.brand,
        "expireDate":self.picker,
        "agent":sessionStorage.getItem('userId'),
        "description":self.description,
      };
      let http = new APIRequest();
      self.isLoading = true;
      let url = `https://dave-inventory.herokuapp.com/api/v1/products`;
      http.post(url, detail, (err,data)=> {
        if (err) {
          self.text = err.error;

          self.isLoading = false;
          self.snackbar = true;
          return;
        }

        self.text = data.success;

        self.isLoading = false;
        self.snackbar = true;

      });
    },
  },
}
</script>

<style scoped>

</style>