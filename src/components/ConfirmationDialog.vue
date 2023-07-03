<template>
    <div class="text-center">
        <v-btn 
            :class="button_class || `text-none`"
            :prepend-icon="button_prepend_icon || 'mdi-check'"
            :variant="button_variant || 'outlined'"
            :color="button_color || 'green'"
            :size="button_size || 'small'"
            :disabled="button_disabled || false"
            :loading="button_loading || false"
            >
            {{ button_text }}
            <v-dialog
                v-model="dialog"
                activator="parent"
                persistent
                width="auto"
                >
                <template v-slot:activator="{ props }">
                    
                </template>
                <v-card>
                    <v-card-title class="text-h5">
                    {{ title }}
                    </v-card-title>
                    <v-card-text>{{ content }}</v-card-text>
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
                        @click=" onApprove(); dialog = false;"
                    >
                        Proceed
                    </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-btn>
    </div>
</template>

<script>

export default {
    name: "ConfirmationDialog",
    props: {
        title: String,
        content: String,
        event_type: String,
        button_text: String,
        button_class: String,
        button_color: String,
        button_prepend_icon: String,
        button_variant: String,
        button_size: String,
        button_disabled: Boolean,
        button_loading: Boolean,
        id: String,
        index: Number
    },
    data () {
        return{
            dialog: false,
        }
    },
    created() {
        
    },
    methods: {
        onApprove(){
            let id = this.id || null;
            let index = this.index || 0;

            let data = { id: id, index: index };

            console.log(data);
            this.emitter.emit(this.event_type, data);
        },
    },
}

</script>

<style scoped>

</style>
  