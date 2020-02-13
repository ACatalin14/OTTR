<template>
    <v-container fluid class="fill-height ma-0">
        <v-row justify="center" align="center" class="fill-height ma-0">
            <v-col cols="12" md="6">
                <v-card style="border-top: solid 5px indigo" class="pt-10 pb-2">
                    <v-row justify="center">
                        <v-img
                            :src="require('@/assets/error-404-logo.png')"
                            alt="Error 404 Logo"
                            contain
                            max-height="94%"
                            max-width="250"
                        />
                    </v-row>
                    <v-row justify="center" class="mt-3">
                        <v-col cols="8">
                            <v-row justify="start">
                                <v-card-title class="display-3">Page not found</v-card-title>
                            </v-row>
                            <v-row justify="start">
                                <v-card-text class="body-1">
                                    We are sorry, it looks like the page you are searching for does not exist.
                                </v-card-text>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    export default {
        name: "PageNotFound"
    }
</script>