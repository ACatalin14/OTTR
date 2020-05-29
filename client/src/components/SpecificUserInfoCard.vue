<template>
    <v-card>
        <v-row class="ml-1" align="center">
            <v-col cols="auto">
                <v-icon v-if="$vuetify.breakpoint.smAndUp" large color="primary">{{ iconName }}</v-icon>
                <v-icon v-else medium color="primary">{{ iconName }}</v-icon>
            </v-col>
            <v-col cols="auto">
                <v-row
                    v-if="$vuetify.breakpoint.smAndUp" no-gutters
                    class="subtitle-1 font-weight-black text-uppercase"
                >
                    {{ propertyTitle }}
                </v-row>
                <v-row v-else no-gutters class="subtitle-2 font-weight-black text-uppercase ml-n3">
                    {{ propertyTitle }}
                </v-row>
                <v-row v-if="$vuetify.breakpoint.smAndUp" no-gutters class="body-1">
                    {{ infoValue }}
                </v-row>
                <v-row v-else no-gutters class="body-2 ml-n3">
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
