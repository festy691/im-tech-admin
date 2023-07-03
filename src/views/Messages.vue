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

        <h4>Messages</h4>
        </v-sheet>

        <v-card variant="outlined" class="px-4 py-8">
            <v-row>
                <v-col cols="6">
                    <SendMessage :users="users"></SendMessage>
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
                :items="messages"
                :search="search"
                :loading="isLoading"
                >

                <template v-slot:item.sn="{ index }">
                    <span class="text-caption">{{ index + 1 }}</span>
                </template>
                <template v-slot:item.user.name="{ item }">
                    <span class="text-caption">{{ item.raw.user.name }}</span>
                </template>
                <template v-slot:item.user.email="{ item }">
                    <span class="text-caption">{{ item.raw.user.email }}</span>
                </template>
                <template v-slot:item.title="{ item }">
                    <span class="text-caption">{{ item.raw.title }}</span>
                </template>
                <template v-slot:item.read="{ item }">
                    <span class="text-caption">{{ item.raw.read ? 'Yes' : 'No' }}</span>
                </template>
                <template v-slot:item.date="{ item }">
                    <span class="text-caption">{{ utils.formatDate(item.raw.date) }}</span>
                </template>
                <template v-slot:item.delete="{ item, index }">
                    <v-row>
                        <ConfirmationDialog
                            button_class="me-2 text-none"
                            button_prepend_icon="mdi-close"
                            button_variant="flat"
                            :button_color="utils.getStatusColor('rejected')"
                            button_size="small"
                            :button_disabled="false"
                            :button_loading="item.raw.loading"
                            button_text='delete'
                            :event_type="rejectEvent"
                            :id="item.raw._id"
                            :index="index"
                            title="Delete message"
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
  import { VDataTable } from 'vuetify/labs/VDataTable';
  import { Utils } from '@/js/Utils';
  import {APIRequest} from "@/js/APIRequest";
  import ConfirmationDialog from '@/components/ConfirmationDialog.vue'
  import SendMessage from '@/components/SendMessage.vue'
  import Loader from '@/components/Loader.vue';

  export default {
    name: 'Messages',
    components: {
        VDataTable,
        ConfirmationDialog,
        SendMessage,
        Loader
    },
    data: () => ({
        isLoading: false,
        processEvent: "process_message_event",
        completeEvent: "complete_message_event",
        rejectEvent: "reject_message_event",
        updateEvent: "update_message_event",
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
            key: 'user.email' 
          },
          { title: 'Title', key: 'title' },
          { title: 'Read', key: 'read' },
          { title: 'Date sent', key: 'date' },
          { title: '', key: 'delete' },
        ],
        messages: [],
        users: [],
    }),
    created() {
        this.getNotifications();
        this.getUsers();
    },
    mounted() { 
        this.emitter.on(this.rejectEvent, value => {
            this.deleteMessage(value.id, value.index);
        });
        this.emitter.on(this.updateEvent, value => {
            this.getNotifications();
        });
    },
    methods: {
       
        getNotifications(){
            if(sessionStorage.getItem('login')){
                let http = new APIRequest();
                let self = this;
                let url = `${http.baseUrl}/notifications`;
                self.isLoading = true;

                http.get(url, (err,data)=> {
                    if(err != null) {
                        self.text = err.message == null ? err : err.message;
                        self.isLoading = false;

                        self.snackbar = true;
                        throw err.error;
                    }
                    self.isLoading = false;
                    self.messages = data;
                });
            }
        },

        deleteMessage(id, index){
            if(sessionStorage.getItem('login')){
                let http = new APIRequest();
                let self = this;
                let url = `${http.baseUrl}/notifications/${id}`;
                self.messages[index].loading = true;

                http.delete(url, (err,data)=> {
                    if(err != null) {
                        self.msg = err.message == null ? err : err.message;
                        self.messages[index].loading = false;

                        self.snackbar = true;
                        throw err.error;
                    }
                    self.messages[index].loading = false;

                    this.emitter.emit(this.updateEvent, data);
                });
            }
        },

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