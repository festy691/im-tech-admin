<template>
  <nav>
    <v-row>
      <v-navigation-drawer v-if="isLoggedIn"
          app
          v-model="drawer"
          theme="dark"
          class="white--text"
          color="#031837"
          >

        <template v-slot:prepend>
          <v-list-item three-line class="my-4">
            <template v-slot:prepend>
              <v-avatar>
                <!-- <v-img
                  src="https://cdn.vuetifyjs.com/images/john.jpg"
                  alt="John"
                ></v-img> -->
                <v-icon icon="mdi-account-circle" size="x-large"></v-icon>
              </v-avatar>
            </template>
            <v-list-item-title class="text-orange font-weight-bold">IMCard admin</v-list-item-title>
          </v-list-item>
        </template>

        <v-divider inset></v-divider>

        <v-list one-line nav class="mt-4">
          <template v-for="(item, index) in items" :key="'second'+index">
            <v-hover v-slot="{ isHovering, props }">
              <v-list-item :prepend-icon="item.icon" :title="item.title" :value="item.title" :to="item.route" v-bind="props">
                <template v-slot:append v-if="item.count > 0">
                  <v-badge
                    color="warning"
                    :content="item.count"
                    inline
                  ></v-badge>
                </template>
              </v-list-item>
            </v-hover>
          </template>
        </v-list>

        <template v-slot:append>
          <div class="pa-2">
            <v-btn block color="#3964AE" @click="logOut()">
              Logout
            </v-btn>
          </div>
        </template>
      </v-navigation-drawer>
      <v-app-bar flat dense class="black" v-if="isLoggedIn">
        <v-app-bar-nav-icon class="text-black" @click="drawer = !drawer"></v-app-bar-nav-icon>
      </v-app-bar>
    </v-row>
    
    
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
    <v-snackbar
        v-model="snackbar2"
        :timeout="timeout"
    >
      {{ text }}

      <template v-slot:action="{ attrs }">
        <v-btn
            color="blue"
            text
            v-bind="attrs"
            @click="snackbar2 = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </nav>
</template>

<script>
import {APIRequest} from "@/js/APIRequest";

export default {
  name: "NavBar",
  data () {
    return{
      snackbar2: false,
      timeout: 2000,
      menu: false,
      snackbar: false,
      drawer: true,
      text: ``,
      //hover: null,
      isLoggedIn: sessionStorage.getItem("login") !== null,
      isAdmin: sessionStorage.getItem('access') === 'admin',
      isLoading: false,
      id: null,
      items: [],
      user: [],
      mini: true,
      isConnected: false,
      socketMessage: '',
      soundUrl : 'http://soundbible.com/mp3/analog-watch-alarm_daniel-simion.mp3',
    }
  },
  created() {
    this.getNavList();

    this.getRecordCount();
  },

  mounted() { 
    let self = this;
      this.emitter.on("login", value => {
        self.getRecordCount();
        self.isAdmin = sessionStorage.getItem('access') === 'admin';
        self.isLoggedIn = true;
        self.getNavList();
      });
      this.emitter.on("logout", value => {
        self.isLoggedIn = false;
      });
  },
  methods: {
    logOut() {
      sessionStorage.clear();
      sessionStorage.removeItem("login");
      sessionStorage.removeItem("access");
      sessionStorage.removeItem("email");
      this.emitter.emit("logout", null);
      this.$router.push('/login');
    },

    getNavList(){
      this.items = [
        { title: 'Dashboard', icon: 'mdi-home-city', route: '/', count: 0 },
        { title: 'Giftcard Trades', icon: 'mdi-gift', route: '/giftcard-trades', count: 0 },
        { title: 'E-Currency Trades', icon: 'mdi-bitcoin', route: '/crypto-trades', count: 0 },
       // { title: 'Crypto trades', icon: 'mdi-bitcoin', route: '/crypto-trades', count: 3 },
        { title: 'Withdraw Request', icon: 'mdi-currency-usd', route: '/withdrawal', count: 0 },
        { title: 'Bill Payments', icon: 'mdi-currency-usd', route: '/bills', count: 0 },
        { title: 'Trade History', icon: 'mdi-history', route: '/trade-history', count: 0 },
        { title: 'Giftcard Setup', icon: 'mdi-cog', route: '/setup' },
        { title: 'E-Currency Setup', icon: 'mdi-cog', route: '/crypto-setup' },
        { title: 'Messages', icon: 'mdi-message', route: '/messages'},
        this.isAdmin ? { title: 'Users', icon: 'mdi-account-group-outline', route: this.isAdmin ? '/users' : '/no-permission', count: 0 } : {},
        this.isAdmin ? { title: 'Pending Verification', icon: 'mdi-card-account-details', route: this.isAdmin ? '/verification' : '/no-permission', count: 0 } : {},
        this.isAdmin ? { title: 'Admin Activities', icon: 'mdi-map-marker', route: this.isAdmin ? '/activities' : '/no-permission', count: 0 } : {},
        // { title: 'News', icon: 'mdi-newspaper', route: '/news'},
        // { title: 'Account Statement', icon: 'mdi-cash-multiple', route: '/account-statement', count: 0 },
      ];
    },

    getRecordCount(){
        if(sessionStorage.getItem('login')){
            let http = new APIRequest();
            let self = this;
            let url = `${http.baseUrl}/users/record/count`;
            self.isLoading = true;

            http.get(url, (err,data)=> {
              if(err != null) {
                  self.text = err.message == null ? err : err.message;
                  self.isLoading = false;

                  self.snackbar = true;
                  throw err.error;
              }
              self.isLoading = false;

              self.items[1].count = data.salesCount;
              self.items[2].count = data.cryptoSalesCount || 0;
              if(self.isAdmin) self.items[9].count = data.kycCount;
              self.items[3].count = data.requestCount;
            });
        }
    },

    playSound () {
      let audio = new Audio(this.soundUrl);
      audio.play();
    },
  },
}

</script>

<style scoped>

</style>
