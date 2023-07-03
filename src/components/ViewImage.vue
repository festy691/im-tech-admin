<template>
  <div class="text-start">
    <v-btn
        color="orange"
        variant="text"
        v-bind="attrs"
        v-on="on">
      View
      <v-dialog
        v-model="dialog"
        activator="parent"
        width="800"
      >
        <template v-slot:activator="{ on, attrs }">
          
        </template>

        <v-card class="pa-8">
          <v-img :src="image"></v-img>
          <v-card-actions>
            <v-btn color="blue" small @click="download(image)">Download</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-btn>
  </div>
</template>

<script>
import saveAs from '@/js/download_file'

export default {
  name: "ViewImage",
  props: {
    image: String
  },
  data () {
    return {
      dialog: false,
    }
  },
  methods: {
    download(image){
          let url = image;
          fetch(url)
              .then((response) => response.blob())
              .then((blob) => {
                  saveAs(blob, 'image_name.jpg');
              });
          console.log('downloading', url);
      },
  },

}

</script>

<style scoped>

</style>