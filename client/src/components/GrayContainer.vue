<template>
    <v-container fluid class="ma-0 px-7 pt-7 pb-1 ">    <!-- removed fill-height class because of notification  !!! -->
        <v-alert
            v-model="notificationState"
            color="accent"
            elevation="2"
            icon="mdi-bell-outline"
            class="mb-5"
            border="left"
            colored-border
            dismissible
            style="width: 100%;"
        >
            {{ this.$store.state.notification.message }}
        </v-alert>
        <v-row id="gray-container" class="fill-height ma-0 pa-0">
            <v-col class="pa-6 pt-5">

                <slot></slot>

            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    export default {
        name: "GrayContainer",
        computed: {
            notificationState: {
                get() {
                    return this.$store.state.notification.state;
                },
                set(value) {
                    if (value) {
                        this.$store.dispatch('showNotification', {
                            msg: this.$store.state.notification.message
                        });
                    } else {
                        this.$store.dispatch('hideNotification');
                    }
                }
            }
        }
    }
</script>

<style scoped>
    #gray-container {
        background-color: #F5F5F5;
    }
</style>