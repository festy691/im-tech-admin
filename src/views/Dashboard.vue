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

        <h4>Dashboard</h4>
      </v-sheet>
      

      <!--    The three row boxes that contains total starts here-->
      <v-row class="pa-4">
        <v-col cols="12" md="4" v-for="(item, index) in menu" :key="index">
          <v-card height="120" flat class="pa-4" variant="outlined">
            <span class="text-black text-h8">{{ item.title }}</span>
            <v-row class="pa-4">
              <v-icon size="x-large" :class="item.color">mdi-chart-bar</v-icon>
              <v-spacer></v-spacer>
              <span :class="item.color"><span class="text-h6">{{ item.value }}</span></span>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
      <!--    The three row boxes that contains total ends here-->

      <!--    The users statistics chart starts here-->
      <v-sheet>
        <v-row class="pa-4">
          <v-col cols="12" md="6" v-if="!isLoadingUserMonthly">
            <bar-chart :chart-data="userChartData" :chart-options="chartOptions" />
          </v-col>
          <v-col cols="12" md="6" v-if="!isLoadingUserYearly">
            <line-chart :chart-data="userLineData" :chart-options="chartOptions" />
          </v-col>
        </v-row>
      </v-sheet>
      <!--    The users statistics chart ends here-->


      <!--    The sales statistics chart starts here-->
      <v-sheet>
        <v-row class="pa-4" v-if="!isLoadingSalesMonthly">
          <v-col cols="12" md="6">
            <bar-chart :chart-data="salesChartData" :chart-options="chartOptions" />
          </v-col>
          <v-col cols="12" md="6" v-if="!isLoadingSalesYearly">
            <line-chart :chart-data="salesLineData" :chart-options="chartOptions" />
          </v-col>
        </v-row>
      </v-sheet>
      <!--    The sales statistics chart ends here-->

    </v-sheet>
  </template>
  
  <script>

  import { Utils } from '@/js/Utils';
import BarChart from '../components/BarChart.vue'
  import LineChart from '../components/LineChart.vue'
  import PieChart from '../components/PieChart.vue'
  import { APIRequest } from '@/js/APIRequest';
  import Loader from '@/components/Loader.vue';

  export default {
    name: 'Dashboard',
    components: { BarChart, LineChart, PieChart, Loader },
    data: () => ({
      snackbar: false,
      drawer: true,
      text: ``,
      isLoading: false,
      isLoadingUserMonthly: false,
      isLoadingUserYearly: false,
      isLoadingSalesMonthly: false,
      isLoadingSalesYearly: false,
      stats: {},
      utils: new Utils(),
      menu: [
          {
            "title": "Total Users", "value": "0", "color": "text-green"
          },
          {
            "title": "Total Funds", "value": "₦ 0", "color": "text-cyan"
          },
          {
            "title": "Total Payouts", "value": "₦ 0", "color": "text-blue"
          },
      ],
      userChartData: {
          labels: [ 'January', 'February', 'March' , 'April' , 'May' , 'June' , 'July' , 'August' , 'September' , 'October' , 'November' , 'December' ],
          datasets: [ 
              { 
                  label: "Users Statistics",
                  backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16', '#f71f13', '#1341f7', '#13f7af', '#f7dc13', '#13c9f7', '#9c13f7', '#baf713', '#3f9682'],
                  data: [40, 20, 12, 40, 50, 63, 23, 20, 57, 90, 99, 45] 
              } 
          ]
      },
      userLineData: {
          labels: [],
          datasets: [ 
              { 
                  label: "Users Statistics",
                  backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16', '#f71f13', '#1341f7', '#13f7af', '#f7dc13', '#13c9f7', '#9c13f7', '#baf713', '#3f9682'],
                  data: [] 
              } 
          ]
      },
      salesChartData: {
          labels: [ 'January', 'February', 'March' , 'April' , 'May' , 'June' , 'July' , 'August' , 'September' , 'October' , 'November' , 'December' ],
          datasets: [ 
              { 
                  label: "Sales Statistics",
                  //backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16', '#f71f13', '#1341f7', '#13f7af', '#f7dc13', '#13c9f7', '#9c13f7', '#baf713', '#3f9682'],
                  data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] 
              } 
          ]
      },
      salesLineData: {
          labels: [],
          datasets: [ 
              { 
                  label: "Sales Statistics",
                  //backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16', '#f71f13', '#1341f7', '#13f7af', '#f7dc13', '#13c9f7', '#9c13f7', '#baf713', '#3f9682'],
                  data: [] 
              } 
          ]
      },
      chartOptions: {
          responsive: true
      },

    }),
    created() {
      if (sessionStorage.getItem("login") === null){
        this.$router.push('/login');
      }
      this.getMonthlyData();
      this.getYearlyData();
      this.getMonthlyUserData();
      this.getYearlyUserData();
      this.getStats();
    },
  
    methods: {
      getMonthlyData(){
        let http = new APIRequest();
        let self = this;
        self.isLoadingSalesMonthly = true;
        let url = `${http.baseUrl}/giftcard-orders/stats/monthly`;
        http.get(url, (err,data)=> {
          if(err != null) {
            self.text = err.message == null ? err : err.message;
            self.isLoadingSalesMonthly = false;
            throw err.error;
          }

          for (let i = 0; i < data.length; i++) {
            let j = data[i]._id - 1;
            self.salesChartData.datasets[0].data[j] = data[i].total;
          }
          self.isLoadingSalesMonthly = false;
        });
      },

      getYearlyData(){
        let http = new APIRequest();
        let self = this;
        self.isLoadingSalesYearly = true;
        let url = `${http.baseUrl}/giftcard-orders/stats/yearly`;
        http.get(url, (err,data)=> {
          if(err != null) {
            self.text = err.message == null ? err : err.message;
            self.isLoadingSalesYearly = false;
            throw err.error;
          }

          for (let i = 0; i < data.length; i++) {
            //let j = data[i]._id - 1;
            self.salesLineData.labels[i] = data[i]._id;
            self.salesLineData.datasets[0].data[i] = data[i].total;
          }
          self.isLoadingSalesYearly = false;
        });
      },

      getMonthlyUserData(){
        let http = new APIRequest();
        let self = this;
        self.isLoadingUserMonthly = true;
        let url = `${http.baseUrl}/users/stats/monthly`;
        http.get(url, (err,data)=> {
          if(err != null) {
            self.text = err.message == null ? err : err.message;
            self.isLoadingUserMonthly = false;
            throw err.error;
          }

          for (let i = 0; i < data.length; i++) {
            let j = data[i]._id - 1;
            self.userChartData.datasets[0].data[j] = data[i].total;
          }
          self.isLoadingUserMonthly = false;
        });
      },

      getYearlyUserData(){
        let http = new APIRequest();
        let self = this;
        self.isLoadingUserYearly = true;
        let url = `${http.baseUrl}/users/stats/yearly`;
        http.get(url, (err,data)=> {
          if(err != null) {
            self.text = err.message == null ? err : err.message;
            self.isLoadingUserYearly = false;
            throw err.error;
          }

          for (let i = 0; i < data.length; i++) {
            //let j = data[i]._id - 1;
            self.userLineData.labels[i] = data[i]._id;
            self.userLineData.datasets[0].data[i] = data[i].total;
          }
          self.isLoadingUserYearly = false;
        });
      },

      getStats(){
        if(sessionStorage.getItem('login')){
          let http = new APIRequest();
          let self = this;
          let url = `${http.baseUrl}/users/record/stats`;
          self.isLoading = true;
          http.get(url, (err,data)=> {
            if(err != null) {
              self.text = err.message == null ? err : err.message;
              self.isLoading = false;
              self.snackbar = true;
              throw err.error;
            }
            self.menu[0].value = data["users"];
            self.menu[1].value = `₦ ${self.utils.formatMoney(data["balance"])}`;
            self.menu[2].value = `₦ ${self.utils.formatMoney(data["payout"])}`;

            console.log(data)
            self.isLoading = false;
            self.stats = data;
          });
        }
      },
    },
  };
  </script>