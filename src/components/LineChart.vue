<template>
    <v-sheet>
        <Line
            id="my-chart-id"
            :options="chartOptions"
            :data="chartData"
        />
    </v-sheet>
  </template>
  
  <script>
  import { Line } from 'vue-chartjs';
  import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

  ChartJS.register(PointElement, LineElement, Title, Tooltip, Legend, PointElement, CategoryScale, LinearScale)

  export default {
    name: "LineChart",
    components: { Line },
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
  