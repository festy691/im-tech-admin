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

        <h4>Admin activities</h4>
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
            :items="activities"
            :search="search"
            :loading="isLoading"
            >

            <template v-slot:item.sn="{ index }">
                <span class="text-caption">{{ index + 1 }}</span>
            </template>
            <template v-slot:item.title="{ item }">
                <span class="text-caption">{{ item.raw.title }}</span>
            </template>
            <template v-slot:item.user.name="{ item }">
                <span class="text-caption">{{ item.raw.user.name }}</span>
            </template>
            <template v-slot:item.status="{ item }">
                <v-chip
                    class="ma-2 text-white"
                    size="small"
                    variant="elevated"
                    :color="utils.getStatusColor(item.raw.status === 'failed' ? 'failed' : 'completed')"
                    >
                    {{ item.raw.status }}
                </v-chip>
            </template>
            <template v-slot:item.user.email="{ item }">
                <span class="text-caption">{{ item.raw.user.email }}</span>
            </template>
            <template v-slot:item.activityId="{ item }">
                <span class="text-caption">{{ item.raw.activityId }}</span>
            </template>
            <template v-slot:item.date="{ item }">
                <span class="text-caption">{{ utils.formatDate(item.raw.date) }}</span>
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
  import { Utils } from '@/js/Utils'
  import {APIRequest} from "@/js/APIRequest";
  import Loader from '@/components/Loader.vue';

  export default {
    name: 'Activities',
    components: {
        VDataTable,
        Loader
    },
    data: () => ({
        isLoading: false,
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
          { title: 'Title', key: 'title' },
          {
            title: 'Name (fullname)',
            key: 'user.name',
          },
          { 
            title: 'Email', 
            key: 'user.email' 
          },
          { title: 'Status', key: 'status' },
          { title: 'Activity ID', key: 'activityId' },
          { title: 'Date', key: 'date' },
        ],
        activities: [],
    }),
    created() {
        this.getActivities();
    },
    mounted() { 
        
    },
    methods: {
        getActivities(){
            if(sessionStorage.getItem('login')){
                let http = new APIRequest();
                let self = this;
                let url = `${http.baseUrl}/activities`;
                self.isLoading = true;

                http.get(url, (err,data)=> {
                if(err != null) {
                    self.text = err.message == null ? err : err.message;
                    self.isLoading = false;

                    self.snackbar = true;
                    throw err.error;
                }
                self.isLoading = false;

                self.activities = data;
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