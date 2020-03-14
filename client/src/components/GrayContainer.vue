<template>
    <v-container fluid class="fill-height ma-0 px-7 pt-7 pb-1 ">
        <v-row id="gray-container" class="fill-height ma-0 pa-0">
            <v-col class="pa-6 pt-5">

                <slot></slot>

            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    export default {
        name: "GrayContainer"
    }
</script>

<style scoped>
    #gray-container {
        background-color: #F5F5F5;
    }
</style>