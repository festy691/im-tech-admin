<template>
  <v-col cols="auto">
    <v-btn
        class="white blue--text"
        @click="downloadFile"
        depressed
        autocapitalize="none"
        min-width="200px">
      <v-icon>mdi-download</v-icon>
      <v-spacer></v-spacer>
      Download Record
    </v-btn>
  </v-col>
</template>

<script>
import Papa from "papaparse";
/*let flatten = require('flat');*/

export default {
  name: "Download-Record",
  props: {
    file: []
  },
  methods: {
    downloadFile(){
      let self = this;
      let blob = new Blob([Papa.unparse(self.file)], { type: 'text/csv;charset=utf-8;' });

      let link = document.createElement("a");

      let url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", 'filename.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
  },
}
</script>

<style scoped>

</style>