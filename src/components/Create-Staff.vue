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
          <v-icon>mdi-account-plus</v-icon>
          <v-spacer></v-spacer>
          Create Staff
        </v-btn>
      </template>
      <template v-slot:default="dialog">
        <v-card>
          <v-toolbar
              color="white"
          >Create New Staff</v-toolbar>

          <div class="pa-4">
            <v-form v-model="valid">
              <v-container>
                <v-row>
                  <v-col
                      cols="12"
                      md="4"
                  >
                    <v-text-field
                        v-model="name"
                        :rules="nameRules"
                        :counter="30"
                        label="Full Name"
                        required
                    ></v-text-field>
                  </v-col>

                  <v-col
                      cols="12"
                      md="4"
                  >
                    <v-text-field
                        v-model="phone"
                        type="tel"
                        :counter="13"
                        label="Phone Number"
                        required
                    ></v-text-field>
                  </v-col>

                  <v-col
                      cols="12"
                      md="4"
                  >
                    <v-text-field
                        v-model="email"
                        type="email"
                        :rules="emailRules"
                        label="E-mail"
                        required
                    ></v-text-field>
                  </v-col>

                  <v-col
                      cols="12"
                      md="4"
                  >
                    <v-select
                        v-model="gender"
                        :items="genders"
                        label="Gender"
                    ></v-select>
                  </v-col>

                  <v-col
                      cols="12"
                      md="4"
                  >
                    <v-text-field
                        v-model="address"
                        label="Address"
                        required
                    ></v-text-field>
                  </v-col>

                  <v-col
                      cols="12"
                      md="4"
                  >
                    <v-text-field
                        v-model="password"
                        label="Password"
                        type="password"
                        required
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </div>
          <center class="mx-8"><v-btn class="blue darken-2 pa-4 white--text" :loading="isLoading" @click="register">Create Staff</v-btn></center>
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
  name: "Create-Staff",
  data() {
    return{
      genders: ['male','female'],
      isLoading: false,
      valid: false,
      name: '',
      phone: '',
      gender: '',
      address: '',
      password: '',
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
    register(){
      let self = this;
      let detail = {
        "name":self.name,
        "phonenumber":self.phone,
        "address":self.address,
        "gender":self.gender,
        "email":self.email,
        "password":self.password,
      };
      let http = new APIRequest();
      self.isLoading = true;
      let url = `https://dave-inventory.herokuapp.com/api/v1/users`;
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