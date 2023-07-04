<template>
    <v-sheet class="px-8">
        <Loader v-if="isLoading" />
        <v-sheet class="d-flex align-center">
            <v-avatar>
                <!-- <v-img
                src="https://cdn.vuetifyjs.com/images/john.jpg"
                alt="John"
                ></v-img> -->
                <v-icon icon="mdi-account-circle" size="x-large"></v-icon>
            </v-avatar>

        <h4>E-Currency Rate Setup</h4>
        </v-sheet>

        <v-card variant="outlined" class="px-4 py-8">
            <v-row>
                <v-col cols="6">
                    
                </v-col>
                <v-col cols="12" md="6">
                    <v-text-field
                        v-model="search"
                        label="Search"
                        append-inner-icon="mdi-magnify"
                        variant="outlined"
                    ></v-text-field>
                </v-col>
            </v-row>
            <v-data-table
                :headers="headers"
                :items="giftcardCategories"
                :search="search"
                :loading="isLoading"
                >

                <template v-slot:item.sn="{ index }">
                    <span class="text-caption">{{ index + 1 }}</span>
                </template>
                <template v-slot:item.start="{ item }">
                    <span class="text-caption">{{ item.value.start }}</span>
                </template>
                <template v-slot:item.stop="{ item }">
                    <span class="text-caption">{{ item.value.stop }}</span>
                </template>
                <template v-slot:item.rate="{ item }">
                    <span class="text-caption">₦{{ utils.formatMoney(item.value.rate) }}</span>
                </template>
                <template v-slot:item.date="{ item }">
                    <span class="text-caption">{{ utils.formatDate(item.value.date) }}</span>
                </template>

                <template v-slot:item.update="{ item }">
                    <update-rate :item="item.value" />
                </template>
            </v-data-table>
        </v-card>

        <v-snackbar v-model="snackbar">
            {{ text }}
            <template v-slot:action="{ attrs }">
                <v-btn
                    color="pink"
                    variant="text"
                    v-bind="attrs"
                    @click="snackbar = false">
                Close
                </v-btn>
            </template>
        </v-snackbar>

    </v-sheet>
</template>
  
<script>
  import { VDataTable } from 'vuetify/labs/VDataTable';
  import { Utils } from '@/js/Utils';
  import {APIRequest} from "@/js/APIRequest";
  import UpdateRate from '@/components/UpdateRate.vue'
  import Loader from '@/components/Loader.vue';

  export default {
    name: 'RateSetup',
    components: {
        VDataTable,
        UpdateRate,
        Loader
    },
    data: () => ({
        isLoading: false,
        updateEvent: "update-rate",
        utils: new Utils(),
        snackbar: false,
        text: ``,
        search: '',
        headers: [
          {
            title: 'S/N',
            align: 'start',
            key: 'sn',
          },
          {
            title: 'Range start',
            key: 'start',
          },
          {
            title: 'Range stop',
            key: 'stop',
          },
          {
            title: 'Rate',
            key: 'rate',
          },
          { title: 'Date added', key: 'date' },
          { title: 'Update', key: 'update' },
        ],
        giftcardCategories: [],
    }),
    created() {
        this.getRate();
    },
    mounted() { 
        this.emitter.on(this.rejectEvent, value => {
            
        });
        this.emitter.on(this.updateEvent, value => {
            this.getRate();
        });
    },
    methods: {
        getRate(){
            if(sessionStorage.getItem('login')){
                let http = new APIRequest();
                let self = this;
                let url = `${http.baseUrl}/rates`;
                self.isLoading = true;

                http.get(url, (err,data)=> {
                    if(err != null) {
                        self.text = err.message == null ? err : err.message;
                        self.isLoading = false;

                        self.snackbar = true;
                        throw err.error;
                    }
                    console.log(data)
                    self.isLoading = false;
                    self.giftcardCategories = data;
                });
            }
        },

        openCountryList(id){
            this.$router.push('/giftcard-country/'+id);
        },
    },
  };
  </script>
  <style scoped>
    .kyc-background-card {
        background-color: #E6F5F9;
        width: 60%;
        border-radius: 16px;
        padding: 24px;
    }
    .table-item {
        background-color: #18d5c6;
        height: 64;
        border-radius: 16px;
    }
</style>