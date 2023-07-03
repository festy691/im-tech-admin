<template>
    <v-overlay v-model="overlay" width="100%" height="100%">
        <v-row align="center" class="fill-height">
            <v-col class="d-flex justify-center">
                <Vue3Lottie :animationData="loader" :height="200" :width="200" />
            </v-col>
        </v-row>
    </v-overlay>
</template>

<script>
import { Vue3Lottie } from 'vue3-lottie'
import 'vue3-lottie/dist/style.css'
import loader from '../assets/loader.json'

  export default {
    name: "Loader",
    props: {
        //overlay: Boolean
    },
    components: {
        Vue3Lottie,
    },
    data: () => ({
      overlay: true,
      loader,
    }),
  }
</script>