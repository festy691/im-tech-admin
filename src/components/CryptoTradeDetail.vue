<template>
    <div class="text-center">
        <v-btn
              color="orange"
              v-bind="attrs"
              v-on="on"
              variant="depressed"
              size="small">
            View
            
            <v-dialog
                v-model="dialog"
                activator="parent"
                width="700"
            >
                <template v-slot:activator="{ on, attrs }">
                
                </template>
        
                <v-card>
                <v-card-title class="text-h5 grey lighten-2 text-center">
                    Trade Details
                </v-card-title>
        
                <v-card-text>
                    <v-table>
                        <thead>
                            <tr>
                                <th class="text-left">
                                    Name
                                </th>
                                <th class="text-right">
                                    Value
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="text-left">Name</td>
                                <td class="text-right">{{order.user.name}}</td>
                            </tr>
                            <tr>
                                <td class="text-left">Email</td>
                                <td class="text-right">{{order.user.email}}</td>
                            </tr>
                            <tr>
                                <td class="text-left">Phone number</td>
                                <td class="text-right">{{order.user.phonenumber}}</td>
                            </tr>
                            <tr>
                                <td class="text-left">Currency name</td>
                                <td class="text-right">{{ order.item }}</td>
                            </tr>
                            <tr>
                                <td class="text-left">Address type</td>
                                <td class="text-right">{{ order.addressType }}</td>
                            </tr>
                            <tr>
                                <td class="text-left">Amount USD</td>
                                <td class="text-right">${{utils.formatMoney(order.priceDollar)}}</td>
                            </tr>
                            <tr>
                                <td class="text-left">Amount</td>
                                <td class="text-right">₦{{utils.formatMoney(order.priceNaira)}}</td>
                            </tr>
                            <tr>
                                <div class="py-4">

                                    <template v-if="order.receipt != null">
                                        <span class="py-4"><h4>Card Images:</h4></span>
                                        <v-row>
                                            <v-col cols="6" md="6">
                                            <v-card class="mx-auto" flat>
                                                <v-card
                                                    class="white--text align-end"
                                                    color="grey lighten-4"
                                                    variant="flat"
                                                    height="60">
                                                </v-card>
                                                <v-card-actions><view-image :image="order.receipt"></view-image></v-card-actions>
                                            </v-card>
                                            </v-col>
                                        </v-row>
                                    </template>

                                </div>
                            </tr>
                        </tbody>
                    </v-table>
                </v-card-text>
                </v-card>
            </v-dialog>
        </v-btn>
    </div>
  </template>
  
  <script>
  import { Utils } from '@/js/Utils';
  import ViewImage from './ViewImage.vue';
  
  export default {
    name: "CryptoTradeDetail",
    components: {ViewImage},
    props: {
      order: Object
    },
    data () {
      return {
        dialog: false,
        isLoading: false,
        granted: false,
        snackbar: false,
        text: ``,
        utils: new Utils()
      }
    },
  
    created() {
        console.log(this.order);
    },
  
    methods: {
        
    },
  }
  </script>
  
  <style scoped>
  
  </style>