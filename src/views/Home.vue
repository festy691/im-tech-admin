<template>
  <v-container fluid class="grey lighten-4">

    <v-row>
      <v-col cols="12" sm="6" md="3" v-for="insight in insights" :key="insight.text">
        <v-card class="pa-2 justify-space-around ma-2" outlined tile>
          <center>
            <div class="ma-2 black--text h3 justify-space-around">{{ insight.value }}</div>
            <div class="black--text h5">{{ insight.text }}</div>
          </center>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <h3>Stock Status</h3>
        <div id="chart">
          <apexchart type="pie" width="400" :options="chartOptions" :series="series"></apexchart>
        </div>
      </v-col>
      <v-col cols="6" md="6">
        <div>
          <apexchart width="400" type="bar" :options="options" :series="barSeries"></apexchart>
        </div>
      </v-col>
    </v-row>

    <div class="black--text mx-2 mb-2 font-weight-bold headline">New Orders</div>
    <v-row>
      <v-col cols="12">
        <v-data-table
            :headers="headers"
            :items="products"
            item-key="_id"
            :search="search"
        >
          <template v-slot:item.agent="{ item }">
            <span>{{ item.agent.name }}</span>
          </template>
          <template v-slot:item.date="{ item }">
            <span v-if="item.date !== undefined">{{ formatDate(item.date) }}</span>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'Home',
    data () {
      return {
        search: '',
        series: [20, 32, 13],
        chartOptions: {
          chart: {
            width: 450,
            type: 'pie',
          },
          labels: ['Total', 'In stock', 'Sold'],
          responsive: [{
            breakpoint: 480,
            options: {
              chart: {
                width: 200
              },
              legend: {
                position: 'bottom'
              }
            }
          }]
        },
        insights: [
          {
            text: "Quantity of items in stock", value: 0,
          },
          {
            text: "Quantity of items sold", value: 0,
          },
          {
            text: "Total price of item in stock", value: 0,
          },
          {
            text: "Total price of item sold", value: 0,
          },
        ],
        headers: [
          {
            text: 'Order ID',
            align: 'start',
            filterable: false,
            value: '_id',
          },
          { text: 'Customer', value: 'user' },
          { text: 'Amount', value: 'priceCash' },
          { text: 'Sales Rep', value: 'agent' },
          { text: 'Date', value: 'date' },
        ],
        products: [],
        options: {
          chart: {
            id: 'vuechart-example'
          },
          xaxis: {
            categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
          }
        },
        barSeries: [{
          name: 'series-1',
          data: [30, 40, 45, 50, 49, 60, 70, 91, 74, 87, 34, 90]
        }]
      }
    },
    created() {
      if (sessionStorage.getItem("login") === null){
        this.$router.push('/login');
      }
    },

  }
</script>

<style scoped>

</style>

<style lang="sass" scoped>

</style>