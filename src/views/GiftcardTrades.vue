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

            <h4>Giftcard Trades</h4>
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
                <template v-slot:item.view="{ item }">
                    <GiftcardTradeDetail :order="item.value"></GiftcardTradeDetail>
                </template>
                <template v-slot:item.date="{ item }">
                    <span class="text-caption">{{ utils.formatDate(item.value.date) }}</span>
                </template>
                <template v-slot:item.verified="{ item, index }">
                    <v-row>
                        <ConfirmationDialog
                            button_class="me-2 text-none"
                            button_prepend_icon="mdi-clock"
                            button_variant="flat"
                            :button_color="utils.getStatusColor('processing')"
                            button_size="small"
                            :button_disabled="item.value.status !== 'pending'"
                            :button_loading="item.value.loadingProcess"
                            button_text='process'
                            :event_type="processEvent"
                            :id="item.value._id"
                            :index="index"
                            title="Process transaction"
                            content="Are you sure? this process cannot be reversed"
                            >
                        </ConfirmationDialog>
                        <ConfirmationDialog
                            button_class="me-2 text-none"
                            button_prepend_icon="mdi-check"
                            button_variant="flat"
                            :button_color="utils.getStatusColor('completed')"
                            button_size="small"
                            :button_disabled="item.value.status !== 'processing'"
                            :button_loading="item.value.loadingComplete"
                            button_text='complete'
                            :event_type="completeEvent"
                            :id="item.value._id"
                            :index="index"
                            title="Complete transaction"
                            content="Are you sure? this process cannot be reversed"
                            >
                        </ConfirmationDialog>
                        <RejectTradeDialog
                            button_class="me-2 text-none"
                            button_prepend_icon="mdi-close"
                            button_variant="flat"
                            :button_color="utils.getStatusColor('rejected')"
                            button_size="small"
                            :button_disabled="item.value.status !== 'processing'"
                            :button_loading="item.value.loadingReject"
                            button_text='reject'
                            :event_type="rejectEvent"
                            :id="item.value._id"
                            :index="index"
                            :user="item.value.user._id"
                            title="Reject transaction"
                            content="Are you sure? this process cannot be reversed"
                            >
                        </RejectTradeDialog>
                    </v-row>
                    
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
  import { VDataTable } from 'vuetify/labs/VDataTable'
  import ConfirmationDialog from '@/components/ConfirmationDialog.vue'
  import RejectTradeDialog from '@/components/RejectTradeDialog.vue';
  import { Utils } from '@/js/Utils'
  import {APIRequest} from "@/js/APIRequest";
  import GiftcardTradeDetail from '@/components/GiftcardTradeDetail.vue';
  import Loader from '@/components/Loader.vue';

  export default {
    name: 'GiftcardTrades',
    components: {
        VDataTable,
        ConfirmationDialog,
        RejectTradeDialog,
        GiftcardTradeDetail,
        Loader
    },
    data: () => ({
        isLoading: false,
        isLoadingProcess: [],
        isLoadingComplete: [],
        isLoadingReject: [],
        processEvent: "process_gift_event",
        completeEvent: "complete_gift_event",
        rejectEvent: "reject_gift_event",
        updateEvent: "update_gift_event",
        utils: new Utils,
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
            title: 'Name (fullname)',
            key: 'user.name',
          },
          { 
            title: 'Amount', 
            key: 'priceNaira' 
          },
          { title: 'Status', key: 'status' },
          { title: 'Date', key: 'date' },
          { title: '', key: 'view' },
          { title: '', key: 'verified' },
        ],
        trades: [],
    }),
    created() {
        this.getGiftcardOrders();
    },
    mounted() { 
        this.emitter.on(this.processEvent, value => {
            this.updateStatus(value.id, 'processing', value.index);
        });
        this.emitter.on(this.rejectEvent, value => {
            this.updateStatus(value.id, 'rejected', value.index);
        });
        this.emitter.on(this.completeEvent, value => {
            this.updateStatus(value.id, 'completed', value.index);
        });
        this.emitter.on(this.updateEvent, value => {
            this.getGiftcardOrders();
        });
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

        async creditUser(amount, userId){
            let self = this;

            let dataBody = {
                "amount": amount,
                "userId": userId
            }

            let http = new APIRequest();
            self.isLoading = true;
            let url = `${http.baseUrl}/transactions/credit`;
            http.post(url, dataBody, (err,data) => {
                if(err != null) {
                self.isLoading = false;
                console.log(err);
                self.text = err.message == null ? err : err.message;
                self.snackbar = true;
                return;
                }
                console.log(data.success);
            });
        },

        updateStatus(id,status,index){
            let self = this;
            
            if (status === 'processing'){
                self.trades[index].loadingProcess = true;
            } else if (status === 'completed'){
                self.trades[index].loadingComplete = true;
            } else {
                self.trades[index].isLoadingReject = true;
            }

            let form = new FormData();
            form.append('status',status);

            let http = new APIRequest();
            self.isLoading = true;
            let url = `${http.baseUrl}/giftcard-orders/${id}`;
            http.putForm(url, form, async (err, data)=> {
                if(err != null) {
                    if (status === 'processing'){
                        self.trades[index].loadingProcess = false;
                    } else if (status === 'completed'){
                        self.trades[index].loadingComplete = false;
                    } else {
                        self.trades[index].isLoadingReject = false;
                    }
                    self.text = err.message == null ? err : err.message;
                    self.snackbar = true;
                    return;
                }
                if (status === 'processing'){
                    self.trades[index].loadingProcess = false;
                } else if (status === 'completed'){
                    await self.creditUser(self.trades[index].priceNaira, self.trades[index].user._id);
                    self.trades[index].loadingComplete = false;
                } else {
                    self.trades[index].isLoadingReject = false;
                }
                self.text = data.success;

                this.emitter.emit(this.updateEvent, self.isLoading);

                self.snackbar = true;
            });
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