<template>
  <nav>
    <v-navigation-drawer
        v-if="isLoggedIn"
        app
        absolute
        permanent
        class="light-blue white--text"
    >
      <template v-slot:prepend>
        <v-list-item three-line>
          <v-list-item-avatar>
            <img v-if="user.image == null" src="https://randomuser.me/api/portraits/women/81.jpg">
            <img v-else :src="user.image">
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title class="white--text">{{ user.name }}</v-list-item-title>
            <v-list-item-subtitle class="white--text">{{ user.email }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>

      <v-divider></v-divider>

      <v-list two-line>
        <template v-for="(item, index) in items">

          <v-divider
              :key="index"
              inset="true" class="grey lighten-2"></v-divider>

          <v-list-item
              :key="index">
            <v-list-item-icon>
              <v-icon class="white--text">{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title class="white--text" v-html="item.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>

        <v-list-item class="pa-8">
          <v-list-item-action class="white--text" @click="logout">Log Out</v-list-item-action>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
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
  </nav>
</template>

<script>
import {EventBus} from "../js/event-bus";
import {APIRequest} from "../js/APIRequest";

export default {
  name: "NavBar",
  data () {
    return{
      snackbar: false,
      text: ``,
      isLoggedIn: sessionStorage.getItem("login") !== null,
      isLoading: false,
      items: [
        { title: 'Dashboard', icon: 'mdi-home-city', route: '/' },
        { title: 'Products', icon: 'mdi-account', route: '/products' },
        { title: 'Active Carts', icon: 'mdi-history', route: '/carts' },
        { title: 'Orders', icon: 'mdi-account-group-outline', route: '/orders' },
        { title: 'Customers', icon: 'mdi-account-group-outline', route: '/customers' },
      ],
      user: [],
      mini: true,
    }
  },
  created() {
    let self = this;
    EventBus.$on('login', login => {
      console.log(login);
      self.isLoggedIn = true;
    });
    self.getUser();
  },
  methods: {
    openProfile(){
      this.$router.push('/profile');
    },
    getUser(){
      if(sessionStorage.getItem('login')){
        let http = new APIRequest();
        let self = this;
        let url = `https://im-tech.herokuapp.com/api/v1/authenticate`;
        http.get(url, (err,data)=> {
          if(err) {
            self.msg = err.error;
            throw err.error;
          }
          console.log(data);
          self.user = data;
          sessionStorage.setItem("userId", data._id);
        });
      }
    },
    logout(){
      if(sessionStorage.getItem('login')){
        let http = new APIRequest();
        let self = this;
        let url = `https://im-tech.herokuapp.com/api/v1/users/logout`;
        http.post(url,{}, (err,data)=> {
          if(err) {
            self.msg = err.error;
            throw err.error;
          }
          self.user = null;
          self.isLoggedIn = false;
          sessionStorage.clear();
          console.log(data);
          this.$router.push('/login');
        });
      }
    },
  }
}
</script>

<style scoped>

</style>
