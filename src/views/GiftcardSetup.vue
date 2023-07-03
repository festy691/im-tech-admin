<template>

  <v-container fluid class="ma-0 pa-0" color="grey lighten-4">

    <v-row>
      <v-col cols="12" md="12">
        <v-card>

          <!--    The appbar that carries the title of the page starts here-->
          <v-sheet class="d-flex align-center">
            <v-avatar>
                <!-- <v-img
                src="https://cdn.vuetifyjs.com/images/john.jpg"
                alt="John"
                ></v-img> -->
                <v-icon icon="mdi-account-circle" size="x-large"></v-icon>
            </v-avatar>

            <h4>Giftcard Setup</h4>
          </v-sheet>
          <!--    The appbar that carries the title of the page ends here-->

          

        </v-card>
      </v-col>
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

  </v-container>

</template>

<script>
import {APIRequest} from "../js/APIRequest";
import AddCategory from "../components/AddCategory";
import UpdateCategory from "../components/UpdateCategory";
import { VDataTable } from 'vuetify/labs/VDataTable'
import Loader from '@/components/Loader.vue';

export default {
  name: "GiftcardSetup",
  components: {UpdateCategory, AddCategory, VDataTable, Loader},
  data() {
    return{
      snackbar: false,
      text: ``,
      isLoadingCategory: false,
      isLoadingCountry: false,
      isLoading: false,

      giftcardCategories: [],

      searchGiftcardCategory: '',
      giftcardCategoryHeaders: [
        {
          title: 'Icon',
          align: 'start',
          filterable: true,
          key: 'icon',
        },
        { title: 'Name', key: 'name' },
        { title: 'Date', key: 'date' },
        { title: '', key: 'view' },
        { title: '', key: 'update' },
      ],
    }
  },

  created() {

    if (sessionStorage.getItem("login") === null) {
      return this.$router.push('/login');
    }
    this.getGiftcardCategory();
  },

  methods: {
    getGiftcardCategory(){
      if(sessionStorage.getItem('login')){
        let http = new APIRequest();
        let self = this;
        let url = `${http.baseUrl}/giftcard-categories`;
        self.isLoadingCategory = true;

        http.get(url, (err,data)=> {
          if(err != null) {
            self.msg = err.message == null ? err : err.message;
            self.isLoadingCategory = false;

            self.snackbar = true;
            throw err.error;
          }
          console.log(data)
          self.isLoadingCategory = false;
          self.giftcardCategories = data;

          this.getGiftcards();
        });
      }
    },

    openCountryList(id){
      this.$router.push('/giftcard-country/'+id);
    },
  },

}
</script>

<style scoped>

</style>