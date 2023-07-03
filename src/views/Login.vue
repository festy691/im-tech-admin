<template>
    <v-sheet width="100%" height="100%" class="mx-auto">
        <v-row align="center" class="fill-height">
            <v-col class="d-flex justify-center">
                <v-card class="justify-space-around pa-8" width="500" height="100%">
                    <v-row>
                        <v-col cols="12" class="px-4">
                        <img alt="Vue logo" src="../assets/logo.png" style="max-height: 50px" class="mt-4 mb-6">
                        </v-col>
                        <v-col cols="12" class="px-4">
                        <v-text-field
                            label="Email"
                            type="email"
                            v-model="email"
                            variant="outlined"
                            required
                        ></v-text-field>
                        </v-col>
                        <v-col cols="12" class="px-4">
                        <v-text-field
                            label="Password"
                            type="password"
                            v-model="password"
                            variant="outlined"
                            required
                        ></v-text-field>
                        </v-col>
                        <v-col cols="12" class="px-4">
                        <v-text-field
                            label="Access Code"
                            type="text"
                            v-model="accessCode"
                            variant="outlined"
                            required
                        ></v-text-field>
                        </v-col>

                        <v-col cols="12">
                            <v-btn block variant="flat" color="primary" rounded="lg" size="x-large" class="text-white" :loading="isLoading" @click="login">Login</v-btn>
                        </v-col>

                    </v-row>
                </v-card>
            </v-col>
        </v-row>

      <v-sheet
          height="100%"
          color="grey-lighten-2"
          >
          <v-img
              class="mx-auto"
              height="100%"
              max-width="500"
              src="../assets/id_card.png">
          </v-img>
      </v-sheet>
  
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
    </v-sheet>
  </template>
  
  <script>
  import {APIRequest} from "../js/APIRequest";
  
  export default {
    name: "Login",
    data(){
      return{
        snackbar: false,
        text: ``,
        email: '',
        password: '',
        accessCode: '',
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
          "firebaseToken": sessionStorage.getItem("firebaseToken")
        };
        console.log(detail);
        let http = new APIRequest();
        self.isLoading = true;
        let url = `${http.baseUrl}/users/login-access`;
        http.login(url, detail, (error,data)=> {
          if (error != null) {
            self.text = error.message == null ? error : error.message;
            self.isLoading = false;
            self.snackbar = true;
          } else {
            if (data.level !== "admin" && data.level !== "sales") {
              self.text = "Access Denied";
              self.isLoading = false;
              self.snackbar = true;
              return;
            }
  
            sessionStorage.setItem("login", data.token);
            sessionStorage.setItem("access", data.level);
            sessionStorage.setItem("email", self.email);
            self.twoFactor();
            //self.isLoading = false;
            //self.$router.push('/');
          }
        });
      },

      twoFactor(){
        let self = this;
        let detail = {
          "token":self.accessCode,
        };
        let http = new APIRequest();
        self.isLoading = true;
        let url = `${http.baseUrl}/users/twofactor/verify`;
        http.post(url, detail, (error,data)=> {
          if (error != null) {
            self.text = error.message == null ? error : error.message;
            self.isLoading = false;
            self.snackbar = true;
            sessionStorage.clear();
          } else {
            self.isLoading = false;
            this.emitter.emit("login", data);
            self.$router.push('/');
          }
        });
      },
    },
  }
  </script>
  
  <style scoped>
  
  </style>
  