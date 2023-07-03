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

      <h4>Giftcard Denomination</h4>
    </v-sheet>

    <v-card variant="outlined" class="px-4 py-8">
          <v-row>
                <v-col cols="6">
                  <add-giftcard :country="id"/>
                </v-col>
                <v-col cols="12" md="6">
                    <v-text-field
                        v-model="searchGiftcard"
                        label="Search"
                        append-inner-icon="mdi-magnify"
                        variant="outlined"
                    ></v-text-field>
                </v-col>
          </v-row>
          <v-data-table
              :headers="giftcardHeaders"
              :items="giftcards"
              :search="search"
              :loading="isLoading"
              >

              <template v-slot:item.sn="{ index }">
                  <span class="text-caption">{{ index + 1 }}</span>
              </template>

              <template v-slot:item.name="{ item }">
                <span class="text-caption">
                   {{ item.value.name }}
                </span>
              </template>

              <template v-slot:item.category.name="{ item }">
                <span class="text-caption">
                   {{ item.value.category.name }}
                </span>
              </template>

              <template v-slot:item.country.name="{ item }">
                <span class="text-caption">
                   {{ item.value.country.name }}
                </span>
              </template>

              <template v-slot:item.ratePhysical="{ item }">
                <span class="text-caption">
                  N {{ utils.formatMoney(item.value.ratePhysical) }}
                </span>
              </template>

              <template v-slot:item.rateECode="{ item }">
                <span class="text-caption">
                  N {{ utils.formatMoney(item.value.rateECode) }}
                </span>
              </template>

              <template v-slot:item.date="{ item }">
                <span class="text-caption">
                  {{ utils.formatDate(item.value.date) }}
                </span>
                
              </template>

              <template v-slot:item.update="{ item }">
                <update-giftcard :item="item.value" :countries="item.value.country._id"/>
              </template>

              <template v-slot:item.delete="{ item, index }">
                <ConfirmationDialog
                    button_class="me-2 text-none"
                    button_prepend_icon="mdi-close"
                    button_variant="flat"
                    :button_color="utils.getStatusColor('rejected')"
                    button_size="small"
                    :button_disabled="item.value.loading"
                    :button_loading="item.value.loading"
                    button_text='delete'
                    :event_type="rejectEvent"
                    :id="item.value._id"
                    :index="index"
                    title="Delete card"
                    content="Are you sure? this process cannot be reversed"
                    >
                </ConfirmationDialog>
              </template>

          </v-data-table>
      </v-card>

    <v-snackbar v-model="snackbar">
      {{ text }}
      <template v-slot:action="{ attrs }">
        <v-btn
            color="pink"
            text
            v-bind="attrs"
            @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>

  </v-sheet>

</template>

<script>
import AddGiftcard from "@/components/AddGiftcard";
import UpdateGiftcard from "@/components/UpdateGiftcard";
import {APIRequest} from "@/js/APIRequest";
import { VDataTable } from 'vuetify/labs/VDataTable';
import { Utils } from '@/js/Utils';
import ConfirmationDialog from '@/components/ConfirmationDialog.vue'
  import Loader from '@/components/Loader.vue';

export default {
  name: "GiftcardDenominations",
  components: {AddGiftcard, UpdateGiftcard, VDataTable, ConfirmationDialog, Loader},
  data() {
    return{
      snackbar: false,
      text: ``,
      isLoadingCategory: false,
      isLoadingCountry: false,
      isLoading: false,
      rejectEvent: "delete_card_event",
      updateEvent: "update_card_event",
      utils: new Utils(),
      id: null,

      giftcards: [],
      searchGiftcard: '',
      giftcardHeaders: [
        { title: 'S/N', key: 'sn', },
        { title: 'Name', key: 'name' },
        { title: 'Category', key: 'category.name' },
        { title: 'Country', key: 'country.name' },
        { title: 'Physical Rate', key: 'ratePhysical' },
        { title: 'Physical E-Code', key: 'rateECode' },
        { title: 'Date', key: 'date' },
        { title: '', key: 'update' },
        { title: '', key: 'delete' },
      ],
    }
  },

  created() {
     let id = this.$route.params.id;
     this.id = id;
     this.getGiftcards(id);
  },

  mounted() { 
      this.emitter.on(this.rejectEvent, value => {
          this.deleteGiftcard(value.id, value.index);
      });
      this.emitter.on(this.updateEvent, value => {
          this.getGiftcards(this.id);
      });
  },

  methods: {
    deleteGiftcard(id, index){
      if(sessionStorage.getItem('login')){
        let http = new APIRequest();
        let self = this;
        let url = `${http.baseUrl}/giftcards/${id}`;
        self.giftcards[index].loading = true;

        http.delete(url, (err,data)=> {
          if(err != null) {
            self.text = err.message == null ? err : err.message;
            self.giftcards[index].loading = false;

            self.snackbar = true;
            throw err.error;
          }
          self.giftcards[index].loading = false;
          this.emitter.emit("update-giftcard", data);
          self.text = "Deleted";
        });
      }
    },

    getGiftcards(id){
      if(sessionStorage.getItem('login')){
        let http = new APIRequest();
        let self = this;
        let url = `${http.baseUrl}/giftcards?country=${id}`;
        self.isLoading = true;

        http.get(url, (err,data)=> {
          if(err != null) {
            self.text = err.message == null ? err : err.message;
            self.isLoading = false;

            self.snackbar = true;
            throw err.error;
          }
          self.isLoading = false;
          self.giftcards = data;
        });
      }
    },
  },
}
</script>

<style scoped>

</style>