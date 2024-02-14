<template>
    <v-sheet class="px-8">
        <Loader v-if="isLoading" />

        <v-card variant="outlined" class="px-4 py-8" v-if="news !== null">
            <v-row>
                <v-img
                    width="100%"
                    height="500px"
                    cover
                    :src="news.image"
                    >
                </v-img>
            </v-row>

            <v-card-subtitle class="pt-4">
                <span class="text-h6">{{ utils.formatDate(news.date) }}</span>
            </v-card-subtitle>

            <v-card-text>
                <div><span class="text-h5">{{news.title}}</span></div>
            </v-card-text>

            <div v-html="news.message"></div>

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
  import { Utils } from '@/js/Utils';
  import {APIRequest} from "@/js/APIRequest";
  import Loader from '@/components/Loader.vue';

  export default {
    name: 'News',
    components: {
        Loader
    },
    data: () => ({
        id: null,
        isLoading: false,
        utils: new Utils(),
        snackbar: false,
        news: null,
        text: ``,
    }),
    created() {
        let id = this.$route.params.id;
        this.id = id;
        this.getNews(id);
    },
    mounted() {
    },
    methods: {
       
        getNews(id){
            if(sessionStorage.getItem('login')){
                let http = new APIRequest();
                let self = this;
                let url = `${http.baseUrl}/updates/${id}`;
                self.isLoading = true;

                http.get(url, (err,data)=> {
                    if(err != null) {
                        self.text = err.message == null ? err : err.message;
                        self.isLoading = false;

                        self.snackbar = true;
                        throw err.error;
                    }
                    self.isLoading = false;
                    console.log(data);
                    self.news = data;
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