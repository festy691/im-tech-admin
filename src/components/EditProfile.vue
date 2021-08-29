<template>
  <v-row justify="center">
    <v-dialog
        v-model="dialog"
        width="600px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
            color="primary"
            dark
            v-bind="attrs"
            v-on="on"
        >
          Edit
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">Edit Profile</span>
        </v-card-title>
        <v-card-text>
          <v-form v-model="valid">
            <v-container>
              <v-row>
                <v-col
                    cols="12"
                    md="6"
                >
                  <v-text-field
                      v-model="name"
                      :rules="nameRules"
                      :counter="30"
                      label="Name"
                      required
                  ></v-text-field>
                </v-col>

                <v-col
                    cols="12"
                    md="6"
                >
                  <v-text-field
                      v-model="phone"
                      label="Phone Number"
                      required
                  ></v-text-field>
                </v-col>

                <v-col
                    cols="12"
                    md="12"
                >
                  <v-textarea
                      name="input-7-1"
                      hint="Hint text"
                      v-model="address"
                      label="Address"
                      required
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="green darken-1"
              text
              @click="dialog = false"
          >
            Close
          </v-btn>
          <v-btn
              color="green darken-1"
              text
              :loading="isLoading"
              @click="update"
          >
            Update
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
  </v-row>
</template>

<script>
import {APIRequest} from "../js/APIRequest";

export default {
  name: "EditProfile",
  props: {
    id: String,
    name: String,
    phone: String,
    address: String,
  },
  data () {
    return {
      snackbar: false,
      text: ``,
      dialog: false,
      valid: false,
      isLoading: false,
      nameRules: [
        v => !!v || 'Name is required',
        v => v.length <= 30 || 'Name must be less than 30 characters',
      ],
    }
  },
  methods: {
  update(){
    let self = this;
    let detail = {
      "phonenumber":self.phone,
      "address":self.address,
      "name":self.name,
    };
    let http = new APIRequest();
    self.isLoading = true;
    let url = `https://dave-inventory.herokuapp.com/api/v1/users/${self.id}`;
    http.put(url, detail, (err,data)=> {
      if (err) {
        if (err.error.message){
          self.text = err.error.message;

          self.isLoading = false;
          self.snackbar = true;
          console.log(err.error.message);
          return;
        }
        self.text = err.error;

        self.isLoading = false;
        self.snackbar = true;
        console.log(err);
        return;
      }
      console.log(data);
      self.text = data.success;

      self.isLoading = false;
      self.snackbar = true;
      self.$emit('updated');

    });
  },
},

}
</script>

<style scoped>

</style>