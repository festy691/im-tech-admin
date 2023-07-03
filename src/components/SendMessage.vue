<template>
  <div class="text-start">
    <v-btn
        color="green"
        variant="text">
        Send message

        <v-dialog
            v-model="dialog"
            activator="parent"
            width="800"
            >
      
            <v-card class="pa-8">
              <v-form
                  ref="form"
                  v-model="valid"
                  lazy-validation>

                <v-row class="pa-4">
                  <v-col cols="12">
                    <v-autocomplete
                      :items="users"
                      v-model="user"
                      :custom-filter="search"
                      color="white"
                      item-title="email"
                      item-value="_id"
                      label="Search for a user..."
                      variant="outlined"
                    ></v-autocomplete>
                  </v-col>


                  <v-col cols="12">
                    <v-text-field
                        label="Title"
                        placeholder="Please enter a message title"
                        v-model="title"
                        required
                        variant="outlined">
                    </v-text-field>
                  </v-col>

                  <v-col cols="12">
                    <v-textarea
                        label="Message"
                        placeholder="Please enter message content"
                        v-model="message"
                        auto-grow
                        variant="outlined"
                        rows="6"
                        row-height="25"
                    ></v-textarea>
                  </v-col>
                </v-row>

                <center>
                  <v-btn variant="flat" class="text-white ma-4" color="primary" :loading="isLoading" @click="sendMessage()">Send message</v-btn>
                </center>
              </v-form>
            </v-card>

        </v-dialog>
    </v-btn>
    
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
  </div>
</template>

<script>
import {APIRequest} from "../js/APIRequest";

export default {
  name: "SendMessage",
  data: () => ({
    dialog: false,
    isLoading: false,
    title: null,
    message: null,
    items: [],
    user: null,
    search: null,
    tab: null,
    valid: true,
    snackbar: false,
    text: ``,

    states: [
      { name: 'Florida', abbr: 'FL', id: 1 },
      { name: 'Georgia', abbr: 'GA', id: 2 },
      { name: 'Nebraska', abbr: 'NE', id: 3 },
      { name: 'California', abbr: 'CA', id: 4 },
      { name: 'New York', abbr: 'NY', id: 5 },
    ],
  }),
  props: {
    users: Array
  },
  watch: {
    search (val) {
      // Items have already been loaded
      console.log(val);
      // if (this.users.length > 0) return

      // let http = new APIRequest();
      // let self = this;
      // let url = `${http.baseUrl}/users`;
      // self.isLoading = true;

      // http.get(url, (err,data)=> {
      //   if(err != null) {
      //     self.text = err.message == null ? err : err.message;
      //     self.isLoading = false;

      //     self.snackbar = true;
      //     throw err.error;
      //   }
      //   self.isLoading = false;
      //   self.items = users;

      // });
    },

  },
  methods: {
    customFilter (item, queryText, itemText) {
        console.log("here");
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
          self.isLoading = false;
          self.items = data;

        });
      }
    },

    sendMessage () {
      let self = this;
      let form = new FormData();

      if(self.user === null){
        self.text = "User is required";
        self.snackbar = true;
        return;
      }

      if(self.title === null){
        self.text = "Title is required";
        self.snackbar = true;
        return;
      }

      if(self.message === null){
        self.text = "Message is required";
        self.snackbar = true;
        return;
      }

      form.append('user',self.user);
      form.append('title',self.title);
      form.append('message', self.message);

      let http = new APIRequest();
      self.isLoading = true;
      let url = `${http.baseUrl}/notifications`;
      http.postForm(url, form, (err,data)=> {
            if(err != null) {
              self.isLoading = false;
              console.log(err);
              self.text = err.message == null ? err : err.message;
              self.snackbar = true;
              return;
            }
            self.isLoading = false;
            self.text = data.success;
            this.emitter.emit("update-messages", data);
            self.snackbar = true;
      });
    },

  },
}
</script>

<style scoped>

</style>