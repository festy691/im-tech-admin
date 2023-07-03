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

        <h4>Verification</h4>
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
            <template v-slot:item.kyc.idType="{ item }">
                <span class="text-caption">{{ item.value.kyc.idType }}</span>
            </template>
            <template v-slot:item.date="{ item }">
                <span class="text-caption">{{ utils.formatDate(item.value.date) }}</span>
            </template>
            <template v-slot:item._id="{ item }">
                <KYCDocument :user="item.value"></KYCDocument>
            </template>
            <template v-slot:item.kyc.verified="{ item, index }">
                <v-row>
                    <ConfirmationDialog
                        button_class="me-2 text-none"
                        button_prepend_icon="mdi-close"
                        button_variant="flat"
                        button_color="red"
                        button_size="small"
                        :id="item.value.kyc._id"
                        :index="index"
                        :button_disabled="item.value.accepting || item.value.rejecting"
                        :button_loading="item.value.rejecting"
                        :button_text="item.value.kyc.verified ? 'revoke' : 'reject'"
                        :event_type="item.value.kyc.verified ? revokeEvent : rejectEvent"
                        :title="item.value.verified ? `Revoke verification`:'Reject verification'"
                        content="Are you sure? this process cannot be reversed"
                        >
                    </ConfirmationDialog>

                    <ConfirmationDialog
                        button_class="text-none"
                        button_prepend_icon="mdi-check"
                        button_variant="outlined"
                        button_color="green"
                        button_size="small"
                        :button_disabled="item.value.kyc.verified || item.value.accepting || item.value.rejecting"
                        :button_loading="item.value.accepting"
                        button_text="approve"
                        :event_type="approveEvent"
                        :id="item.value.kyc._id"
                        :index="index"
                        title="Approve verification"
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
  import KYCDocument from '@/components/KYCDocument.vue';
  import { Utils } from '@/js/Utils';
  import {APIRequest} from "@/js/APIRequest";
  import Loader from '@/components/Loader.vue';

  export default {
    name: 'PendingVerification',
    components: {
    VDataTable,
    ConfirmationDialog,
    KYCDocument,
    Loader
},
    data: () => ({
        isLoading: false,
        isLoadingApprove: [],
        isLoadingReject: [],
        approveEvent: "approve_id_event",
        rejectEvent: "reject_id_event",
        revokeEvent: "revoke_id_event",
        updateEvent: "update_id_event",
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
            key: 'name',
          },
          { 
            title: 'Email', 
            key: 'email' 
          },
          { title: 'ID type', key: 'kyc.idType' },
          { title: 'Date', key: 'date' },
          { title: '', key: '_id' },
          { title: '', key: 'kyc.verified' },
        ],
        users: [],
    }),
    created() {
        this.getUsers();
    },
    mounted() { 
        this.emitter.on(this.approveEvent, value => {
            this.verifyUser(value.id, true, value.index, true);
        });
        this.emitter.on(this.rejectEvent, value => {
            this.verifyUser(value.id, false, value.index, false);
        });
        this.emitter.on(this.revokeEvent, value => {
            this.verifyUser(value.id, false, value.index, false);
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
          let url = `${http.baseUrl}/users/verification/unverified`;
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
            self.users = data;

          });
        }
      },

      verifyUser(id,value,index,accepting){
        if(sessionStorage.getItem('login')){
          let http = new APIRequest();
          let self = this;
          let url = `${http.baseUrl}/users/verification/verify/${id}`;

          if (accepting){
            self.users[index].accepting = true;
          } else {
            self.users[index].rejecting = true;
          }

          http.put(url, {"verified":value},(err,data)=> {
            if(err != null) {
              self.text = err.message == null ? err : err.message;
              if (accepting){
                self.users[index].accepting = false;
              } else {
                self.users[index].rejecting = false;
              }

              self.snackbar = true;
              throw err.error;
            }
            if (accepting){
              self.users[index].accepting = false;
            } else {
              self.users[index].rejecting = false;
            }

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