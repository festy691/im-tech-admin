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

        <h4>Trade History</h4>
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
            :items="trades"
            :search="search"
            :loading="isLoading"
            >

            <template v-slot:item.sn="{ index }">
                <span class="text-caption">{{ index + 1 }}</span>
            </template>
            <template v-slot:item.user.name="{ item }">
                <span class="text-caption">{{ item.value.user.name }}</span>
            </template>
            <template v-slot:item.user.email="{ item }">
                <span class="text-caption">{{ item.value.user.email }}</span>
            </template>
            <template v-slot:item.itemDescription="{ item }">
                <span class="text-caption">{{ item.value.itemDescription }}</span>
            </template>
            <template v-slot:item.country="{ item }">
                <span class="text-caption">{{ item.value.country.name }}</span>
            </template>
            <template v-slot:item.priceNaira="{ item }">
                <span class="text-caption">₦{{ utils.formatMoney(item.value.priceNaira) }}</span>
            </template>
            <template v-slot:item.status="{ item }">
                <v-chip
                    class="ma-2 text-white"
                    size="small"
                    variant="elevated"
                    :color="utils.getStatusColor(item.value.status)"
                    >
                    {{ item.value.status }}
                </v-chip>
            </template>
            <template v-slot:item.date="{ item }">
                <span class="text-caption">{{ utils.formatDate(item.value.date) }}</span>
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
  import Loader from '@/components/Loader.vue';

  export default {
    name: 'TradingHistory',
    components: {
        VDataTable,
        Loader
    },
    data: () => ({
        isLoading: false,
        processEvent: "process_trade_event",
        completeEvent: "complete_trade_event",
        rejectEvent: "reject_trade_event",
        updateEvent: "update_trade_event",
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
            title: 'Name',
            key: 'user.name',
          },
          {
            title: 'Email',
            key: 'user.email',
          },
          { 
            title: 'Amount', 
            key: 'priceNaira' 
          },
          { 
            title: 'Type', 
            key: 'itemDescription' 
          },
          { 
            title: 'Country', 
            key: 'country' 
          },
          { title: 'Status', key: 'status' },
          { title: 'Date', key: 'date' },
        ],
        trades: [],
    }),
    created() {
        this.getGiftcardOrders();
    },
    mounted() { 
    },
    methods: {
       
        getGiftcardOrders(){
            if(sessionStorage.getItem('login')){
                let http = new APIRequest();
                let self = this;
                let url = `${http.baseUrl}/giftcard-orders`;
                self.isLoading = true;

                http.get(url, (err,data)=> {
                    if(err != null) {
                        self.text = err.message == null ? err : err.message;
                        self.isLoading = false;

                        self.snackbar = true;
                        throw err.error;
                    }
                    self.isLoading = false;
                    self.trades = data;
                });
            }
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