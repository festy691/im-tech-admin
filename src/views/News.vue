<template>
    <v-sheet class="px-8">
        <Loader v-if="isLoading" />
        <div class="d-flex justify-space-between">
            <h4>News Update</h4>

            <AddNews />
        </div>

        <v-card class="py-8" variant="flat">
            <v-row>
                <v-col cols="12" md="4" v-for="n in news">
                    <v-card
                        class="mx-auto"
                        max-width="400"
                    >
                        <v-img
                        class="align-end text-white"
                        height="200"
                        :src="n.image"
                        cover
                        >
                        <v-card-title>{{n.title}}</v-card-title>
                        </v-img>

                        <v-card-subtitle class="pt-4">
                            {{ utils.formatDate(n.date) }}
                        </v-card-subtitle>

                        <v-card-text>
                        <div class="headerClass">{{n.title}}</div>
                        </v-card-text>

                        <v-card-actions>
                        <v-btn color="orange" @click="openNews(n._id)">
                            View
                        </v-btn>

                        <v-btn color="orange" @click="deleteNews(n._id)">
                            Delete
                        </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
            <div class="text-center">
                <v-container>
                <v-row justify="center">
                    <v-col cols="8">
                    <v-container class="max-width">
                        <v-pagination
                        v-model="page"
                        class="my-4"
                        :length="pages"
                        ></v-pagination>
                    </v-container>
                    </v-col>
                </v-row>
                </v-container>
            </div>
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
  import AddNews from '@/components/AddNews.vue'
  import Loader from '@/components/Loader.vue';

  export default {
    name: 'News',
    components: {
        AddNews,
        Loader
    },
    data: () => ({
        isLoading: false,
        processEvent: "process_news_event",
        completeEvent: "complete_news_event",
        rejectEvent: "reject_news_event",
        updateEvent: "update_news_event",
        utils: new Utils(),
        snackbar: false,
        text: ``,
        news: [],
        users: [],
        page: 1,
        pages: 1,
    }),
    created() {
        this.getNews();
    },
    mounted() { 
        this.emitter.on(this.rejectEvent, value => {
            this.deleteMessage(value.id, value.index);
        });
        this.emitter.on(this.updateEvent, value => {
            this.getNews();
        });
    },
    methods: {
       
        getNews(){
            if(sessionStorage.getItem('login')){
                let http = new APIRequest();
                let self = this;
                let url = `${http.baseUrl}/updates/paginate/posts?page=${this.page}&perPage=10`;
                self.isLoading = true;

                http.get(url, (err,data)=> {
                    if(err != null) {
                        self.text = err.message == null ? err : err.message;
                        self.isLoading = false;

                        self.snackbar = true;
                        throw err.error;
                    }
                    self.isLoading = false;
                    self.news = data.docs;
                    self.pages = data.pages
                });
            }
        },

        deleteNews(id){
            if(sessionStorage.getItem('login')){
                let http = new APIRequest();
                let self = this;
                let url = `${http.baseUrl}/notifications/${id}`;
                self.isLoading = true;

                http.delete(url, (err,data)=> {
                    if(err != null) {
                        self.text = err.message == null ? err : err.message;
                        self.isLoading = false;

                        self.snackbar = true;
                        throw err.error;
                    }
                    self.isLoading = false;

                    this.emitter.emit(this.updateEvent, data);
                });
            }
        },

        openNews(id){
            this.$router.push('/news-detail/'+id);
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
    .headerClass{
        white-space: nowrap ;
        word-break: normal;
        overflow: hidden ;
        text-overflow: ellipsis;
    }
</style>