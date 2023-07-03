<template>
    <v-sheet>
        <Pie
            id="my-chart-id"
            :options="chartOptions"
            :data="chartData"
        />
    </v-sheet>
  </template>
  
  <script>
  import { Pie } from 'vue-chartjs';
  import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

  ChartJS.register(ArcElement, Tooltip, Legend)

  export default {
    name: "PieChart",
    components: { Pie },
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
  