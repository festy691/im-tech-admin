<template>
  <v-container fluid>
    <center>
      <v-card class="justify-space-around ma-10 pa-8" width="300" height="400">
        <v-row>
          <v-col cols="12" class="px-4">
            <img alt="Vue logo" src="../assets/logo.png" style="max-height: 50px" class="mt-4 mb-6">
          </v-col>
          <v-col cols="12" class="px-4">
            <v-text-field
                label="Email"
                type="email"
                v-model="email"
                outlined
            ></v-text-field>
          </v-col>
          <v-col cols="12" class="px-4">
            <v-text-field
                label="Password"
                type="password"
                v-model="password"
                outlined
            ></v-text-field>
          </v-col>
        </v-row>
        <center><v-btn class="blue darken-2 pa-4" :loading="isLoading" @click="login">Login</v-btn></center>
      </v-card>
    </center>

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
  </v-container>
</template>

<script>
import {APIRequest} from "../js/APIRequest";
import {EventBus} from "../js/event-bus";

export default {
  name: "Login",
  data(){
    return{
      snackbar: false,
      text: ``,
      email: '',
      password: '',
      isLoading: false,
    }
  },
  created() {
    if (sessionStorage.getItem("login") !== null){
      this.$router.push('/');
    }
  },
  methods: {
    login(){
      let self = this;
      let detail = {
        "email":self.email,
        "password":self.password,
      };
      let http = new APIRequest();
      self.isLoading = true;
      let url = `https://im-tech.herokuapp.com/api/v1/users/login`;
      http.login(url, detail, (err,data)=> {
        if (err) {
          self.text = err.error;

          self.isLoading = false;
          self.snackbar = true;
          return;
        }
        /*if (data.level !== "admin" && data.level !== "seller") {
          self.text = "Access Denied";

          self.isLoading = false;
          self.snackbar = true;
          return;
        }*/
        console.log(data);
        sessionStorage.setItem("login", data.token);
        EventBus.$emit('login', data.token);
        self.isLoading = false;
        self.$router.push('/');

      });
    },
  },
}
</script>

<style scoped>

</style>