<template>
    <v-sheet>
        <Bar
            id="my-chart-id"
            :options="chartOptions"
            :data="chartData"
        />
    </v-sheet>
  </template>
  
  <script>
  import { Bar } from 'vue-chartjs';
  import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

  ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

  export default {
    name: "BarChart",
    components: { Bar },
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
  