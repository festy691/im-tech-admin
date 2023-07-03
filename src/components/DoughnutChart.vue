<template>
    <v-sheet>
        <Doughnut
            id="my-chart-id"
            :options="chartOptions"
            :data="chartData"
        />
    </v-sheet>
  </template>
  
  <script>
  import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js'
  import { Doughnut } from 'vue-chartjs'

  ChartJS.register(ArcElement, Tooltip, Legend, Title)

  export default {
    name: "DoughnutChart",
    components: { Doughnut },
    props: {
      chartData: {
          type: Object,
          required: true
        },
      chartOptions: {
        type: Object,
        default: () => {}
      },
      title: String
    },
    data () {
      return{
        
      }
    },
    created() {
      
    },
    methods: {
      
    },
  }
  
  </script>
  
  <style scoped>
    
  </style>
  