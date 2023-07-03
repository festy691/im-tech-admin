<template>
    <div class="text-center">
        <v-btn 
            class="text-none text-white"
            prepend-icon="mdi-eye"
            variant="flat"
            color="orange"
            size="small"
            >
            view
            <v-dialog
                v-model="dialog"
                activator="parent"
                persistent
                width="700"
                >
                <v-card class="pa-8">
                    <v-form>
                        <v-row>
                            
                            <v-col cols="12" md="6">
                                <v-sheet
                                    height="100%"
                                    color="grey-lighten-2"
                                    >
                                    <v-avatar
                                        color="grey"
                                        size="150"
                                        rounded="0"
                                    >
                                        <v-img cover :src="user.kyc.selfie"></v-img>
                                    </v-avatar>
                                </v-sheet>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-sheet
                                    height="100%"
                                    color="grey-lighten-2"
                                    >
                                    <v-img
                                        class="mx-auto"
                                        height="100%"
                                        lazy-src="https://picsum.photos/id/11/100/60"
                                        max-width="500"
                                        :src="user.kyc.idCardImage">
                                    </v-img>
                                </v-sheet>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field
                                    v-model="user.name"
                                    label="Name"
                                    readonly
                                    >
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field
                                    v-model="user.email"
                                    label="Email"
                                    readonly
                                    >
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field
                                    v-model="user.kyc.idType"
                                    label="ID Type"
                                    readonly
                                    >
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field
                                    v-model="user.kyc.idCardNumber"
                                    label="ID Number"
                                    readonly
                                    >
                                </v-text-field>
                            </v-col>
                        </v-row>
                    </v-form>
                    
                    <v-card-actions>
                    <v-spacer></v-spacer>
                        <v-btn
                            color="green-darken-1"
                            variant="text"
                            @click="dialog = false"
                        >
                            Close
                        </v-btn>
                        <v-btn
                            color="green-darken-1"
                            variant="text"
                            @click="download(user.kyc.idCardImage)"
                        >
                            Download
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-btn>
    </div>
</template>

<script>
import saveAs from '@/js/download_file'

export default {
    name: "KYCDocument",
    props: {
        user: Object
    },
    data () {
        return{
            dialog: false,
        }
    },
    created() {
        
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
  