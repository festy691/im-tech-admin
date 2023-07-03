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

        <h4>Users</h4>
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
            :items="users"
            :search="search"
            :loading="isLoading"
            >

            <template v-slot:item.sn="{ index }">
                <span class="text-caption">{{ index + 1 }}</span>
            </template>
            <template v-slot:item.name="{ item }">
                <span class="text-caption">{{ item.value.name }}</span>
            </template>
            <template v-slot:item.email="{ item }">
                <span class="text-caption">{{ item.value.email }}</span>
            </template>
            <template v-slot:item.phonenumber="{ item }">
                <span class="text-caption">{{ item.value.phonenumber }}</span>
            </template>
            <template v-slot:item.walletBalance="{ item }">
                <span class="text-caption">₦{{ utils.formatMoney(item.value.walletBalance) }}</span>
            </template>
            <template v-slot:item.level="{ item }">
                <span class="text-caption">{{ item.value.level }}</span>
            </template>
            <template v-slot:item.kyc="{ item }">
                <span v-if="!item.value.hasSubmittedID" class="text-caption">{{ item.value.hasSubmittedID }}</span>
                <span v-else class="text-caption">{{ item.value.kyc.verified }}</span>
            </template>
            <template v-slot:item._id="{ item, index }">
                <v-row>
                    <ConfirmationDialog v-if="!item.value.suspended"
                        button_class="me-2 text-none"
                        button_prepend_icon="mdi-close"
                        button_variant="flat"
                        button_color="red"
                        button_size="small"
                        :button_disabled="item.value.loading"
                        :button_loading="item.value.loading"
                        button_text="block"
                        :event_type="blockEvent"
                        title="Block user"
                        :id="item.value._id"
                        :index="index"
                        content="Are you sure? this user will no longer have access to their account until you unblock them"
                        >
                    </ConfirmationDialog>
                    <ConfirmationDialog v-else
                        button_class="me-2 text-none"
                        button_prepend_icon="mdi-check"
                        button_variant="flat"
                        button_color="green"
                        button_size="small"
                        :button_disabled="item.value.loading"
                        :button_loading="item.value.loading"
                        button_text="unblock"
                        :event_type="unblockEvent"
                        title="Unblock user"
                        :id="item.value._id"
                        :index="index"
                        content="Are you sure? this user will regain full access to their account"
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
import KYCDocument from '@/components/KYCDocument.vue';
import { Utils } from '@/js/Utils';
import {APIRequest} from "@/js/APIRequest";
import Loader from '@/components/Loader.vue';

  export default {
    name: 'Users',
    components: {
    VDataTable,
    ConfirmationDialog,
    KYCDocument,
    Loader
},
    data: () => ({
        loading: false,
        isLoadingUnblocking: [],
        isLoadingBlocking: [],
        unblockEvent: "unblock_user_event",
        blockEvent: "block_user_event",
        revokeEvent: "revoke_user_event",
        updateEvent: "update_user_event",
        utils: new Utils(),
        snackbar: false,
        text: ``,
        isLoading: false,
        granted: false,
        users: [],
        giftcards: [],
        access: sessionStorage.getItem('access'),
        search: '',
        headers: [
          {
            title: 'S/N',
            align: 'start',
            key: 'sn',
          },
          {
            title: 'Name (fullname)',
            key: 'name',
          },
          { 
            title: 'Email', 
            key: 'email' 
          },
          { title: 'Phone number', key: 'phonenumber' },
          { title: 'Balance', key: 'walletBalance' },
          { title: 'Level', key: 'level' },
          { title: 'Verified', key: 'kyc' },
          { title: '', key: '_id' },
        ],
    }),
    created() {
        if (sessionStorage.getItem("login") === null){
            this.$router.push('/login');
        }
        this.getUsers();
    },
    mounted() { 
        this.emitter.on(this.unblockEvent, value => {
            this.suspendUser(value.id, false, value.index);
        });
        this.emitter.on(this.blockEvent, value => {
            this.suspendUser(value.id, true, value.index);
        });
        this.emitter.on(this.updateEvent, value => {
            this.getUsers();
        });
    },
    methods: {
        getUsers(){
            if(sessionStorage.getItem('login')){
                let http = new APIRequest();
                let self = this;
                let url = `${http.baseUrl}/users`;
                self.isLoading = true;

                http.get(url, (err,data)=> {
                    if(err != null) {
                        self.text = err.message == null ? err : err.message;
                        self.isLoading = false;

                        self.snackbar = true;
                        throw err.error;
                    }
                    let result = [];
                    for (let i=0; i<data.length; i++){
                        let value = data[i];
                        value['loading'] = false;
                        result.push(value);
                    }
                    self.isLoading = false;
                    self.users = result;
                    console.log(self.users);
                });
            }
        },

        suspendUser(user,value,index){
            console.log(index);
            if(sessionStorage.getItem('login')){
                let http = new APIRequest();
                let self = this;
                let url = `${http.baseUrl}/users/suspend/${user}`;
                console.log(index);
                self.users[index].loading = true;
 
                http.put(url, {"suspended":value},(err,data)=> {
                    if(err != null) {
                        self.text = err.message == null ? err : err.message;
                        self.users[index].loading = false;

                        self.snackbar = true;
                        throw err.error;
                    }
                    self.users[index].loading = false;

                    this.emitter.emit(this.updateEvent, self.isLoading);
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