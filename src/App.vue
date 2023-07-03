<template>
  <v-app>
    <NavBar />
    <v-main class="grey lighten-4">
      <router-view class="white"></router-view>
    </v-main>
    <!-- <notifications group="sales" position="bottom right" /> -->
  </v-app>
</template>

<script>

import NavBar from "./components/NavBar";

export default {
  name: 'App',
  components: {NavBar},
  data: () => ({
    listenersStarted: false,
    idToken: "",
    vapidKey: "BCg9u_3RH7lsf4K-gx1v7n7blcZ6ag34AmeKjF7T8AyM0eEaRRVv-AFp_9sueVVnO3Fm0fbmLFR6GBIJZSiTtNE",
  }),
  created() {
    this.$messaging.usePublicVapidKey(this.vapidKey);
    this.startListeners();
  },

  methods: {
    // FCM NOTIFICATION FUNCTIONS
    async startListeners() {
      await this.requestPermission();
      await this.getIdToken();
      this.listenersStarted = true;
    },

    startOnMessageListener() {
      try {
        this.$messaging.onMessage((payload) => {
          console.info("Message received : ", payload);
          console.log(payload.notification.body);
        });
      } catch (e) {
        console.error("Error : ", e);
      }
    },
    
    async requestPermission() {
      try {
        await this.$messaging.requestPermission();
        //const permission = await Notification.requestPermission();
        console.log("GIVEN notify perms");
        //console.log(permission);
      } catch (e) {
        console.error("Error : ", e);
      }
    },

    async getIdToken() {
      try {
        this.idToken = await this.$messaging.getToken();
        console.log("TOKEN ID FOR this browser");
        console.log(this.idToken);
        sessionStorage.setItem('firebaseToken', this.idToken);
        this.startOnMessageListener();
      } catch (e) {
        console.error("Error : ", e);
      }
    },
  },
};
</script>