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

        <h4>Withdraw Funds</h4>
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
            :items="funds"
            :search="search"
            :loading="isLoading"
            >

            <template v-slot:item.sn="{ index }">
                <span class="text-caption">{{ index + 1 }}</span>
            </template>
            <template v-slot:item.user.name="{ item }">
                <span class="text-caption">{{ item.value.user.name }}</span>
            </template>
            <template v-slot:item.amount="{ item }">
                <span class="text-caption">₦{{ utils.formatMoney(item.value.amount) }}</span>
            </template>
            <template v-slot:item.balanceAfterTransaction="{ item }">
                <span class="text-caption">₦{{ utils.formatMoney(item.value.balanceAfterTransaction) }}</span>
            </template>
            <template v-slot:item.active="{ item }">
                <v-chip
                    class="ma-2 text-white"
                    size="small"
                    variant="elevated"
                    :color="utils.getStatusColor(item.value.transactionType === 'debit' ? 'failed' : item.value.transactionType === 'request' ? 'pending' : 'completed')"
                    >
                    {{ item.value.transactionType }}
                </v-chip>
            </template>
            <template v-slot:item.user.bankName="{ item }">
                <span class="text-caption">{{ item.value.user.bankName }}</span>
            </template>
            <template v-slot:item.user.accountNumber="{ item }">
                <span class="text-caption">{{ item.value.user.accountNumber }}</span>
            </template>
            <template v-slot:item.date="{ item }">
                <span class="text-caption">{{ utils.formatDate(item.value.date) }}</span>
            </template>
            <template v-slot:item.loading="{ item, index }">
                <v-row>
                    <ConfirmationDialog v-if="item.value.transactionType === 'request'"
                        button_class="me-2 text-none"
                        button_prepend_icon="mdi-check"
                        button_variant="flat"
                        :button_color="utils.getStatusColor('completed')"
                        button_size="x-small"
                        :button_disabled="!item.value.active"
                        :button_loading="item.value.loading"
                        button_text='complete'
                        :event_type="completeEvent"
                        :id="JSON.stringify(item.value)"
                        :index="index"
                        title="Approve Withdrawal"
                        content="Are you sure? this process cannot be reversed"
                        >
                    </ConfirmationDialog>
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
  import { Utils } from '@/js/Utils'
  import {APIRequest} from "@/js/APIRequest";
  import Loader from '@/components/Loader.vue';

  export default {
    name: 'WithdrawFunds',
    components: {
        VDataTable,
        ConfirmationDialog,
        Loader
    },
    data: () => ({
        isLoading: false,
        isLoadingProcess: [],
        isLoadingComplete: [],
        isLoadingReject: [],
        processEvent: "process_fund_event",
        completeEvent: "complete_fund_event",
        rejectEvent: "reject_fund_event",
        updateEvent: "update_fund_event",
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
            title: 'Name (fullname)',
            key: 'user.name',
          },
          { 
            title: 'Amount', 
            key: 'amount' 
          },
          { title: 'Balance', key: 'balanceAfterTransaction' },
          { title: 'Status', key: 'active' },
          { title: 'Bank', key: 'user.bankName' },
          { title: 'Account number', key: 'user.accountNumber' },
          { title: 'Date', key: 'date' },
          { title: '', key: 'loading' },
        ],
        funds: [],
    }),
    created() {
        this.getFundHistory();
    },
    mounted() { 
        this.emitter.on(this.completeEvent, value => {
            let data = JSON.parse(value.id);
            this.creditUser(data, value.index);
        });
        this.emitter.on(this.updateEvent, value => {
            this.getFundHistory();
        });
    },
    methods: {
        getFundHistory(){
            if(sessionStorage.getItem('login')){
                let http = new APIRequest();
                let self = this;
                let url = `${http.baseUrl}/transactions`;
                self.isLoading = true;

                http.get(url, (err,data)=> {
                if(err != null) {
                    self.text = err.message == null ? err : err.message;
                    self.isLoading = false;

                    self.snackbar = true;
                    throw err.error;
                }
                self.isLoading = false;

                self.funds = data;
                });
            }
        },

        async creditUser(item, index){    
            let self = this;

            let dataBody = {
                "transactionId": item._id,
                "userId": item.user._id
            }

            let http = new APIRequest();
            self.funds[index].loading = true;
            let url = `${http.baseUrl}/transactions/rectify`;
            http.post(url, dataBody, (err,data)=> {
                if(err != null) {
                    self.funds[index].loading = false;
                    self.text = err.message == null ? err : err.message;
                    self.snackbar = true;
                    return;
                }
                self.funds[index].loading = false;
                self.text = data.success;
                self.snackbar = true;
                this.emitter.emit(this.updateEvent, self.isLoading);
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