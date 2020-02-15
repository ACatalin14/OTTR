<template>
    <v-card>
        <v-row class="ml-1" align="center">
            <v-col cols="auto">
                <v-icon large color="primary">{{ iconName }}</v-icon>
            </v-col>
            <v-col cols="auto">
                <v-row no-gutters class="subtitle-1 font-weight-black text-uppercase">
                    {{ propertyTitle }}
                </v-row>
                <v-row no-gutters class="body-1">
                    {{ infoValue }}
                </v-row>
            </v-col>
        </v-row>
    </v-card>
</template>

<script>
    export default {
        name: "SpecificUserInfoCard",
        props: ['infoValue', 'propertyTitle', 'iconName', 'isPassword']
    }
</script>
