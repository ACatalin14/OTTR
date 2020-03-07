<template>
    <v-container fluid class="ma-0 px-7 pt-7 pb-1 ">
        <v-row id="students-container" class="ma-0 pa-0">
            <v-col class="pa-6 pt-5">
                <h1 class="headline font-weight-black mb-4 pa-0">Students Administration</h1>
                <v-divider></v-divider>
<!--                <v-row class="mt-3">-->
<!--                    <v-col>-->
<!--                        <v-card>-->
<!--                            <v-card-title>-->
<!--                                Expiration Date-->
<!--                            </v-card-title>-->
<!--                            <v-card-text>-->
<!--                                <p>-->
<!--                                    Set a default expiration date for all newly added student cards. This should be-->
<!--                                    changed-->
<!--                                    once a year, when a new academic years starts.-->
<!--                                </p>-->
<!--                                <v-dialog-->
<!--                                    ref="dialogCalendar"-->
<!--                                    v-model="modal"-->
<!--                                    :return-value.sync="expirationDate"-->
<!--                                    persistent-->
<!--                                    width="300px"-->
<!--                                >-->
<!--                                    <template v-slot:activator="{ on }">-->
<!--                                        <v-text-field-->
<!--                                            v-model="expirationDate"-->
<!--                                            label="Choose a Date"-->
<!--                                            color="primary"-->
<!--                                            readonly-->
<!--                                            v-on="on"-->
<!--                                        >-->
<!--                                            <template v-slot:prepend>-->
<!--                                                <v-icon color="primary">mdi-calendar</v-icon>-->
<!--                                            </template>-->
<!--                                        </v-text-field>-->
<!--                                    </template>-->
<!--                                    <v-date-picker v-model="expirationDate" :min="new Date().toISOString()" scrollable>-->
<!--                                        <v-spacer></v-spacer>-->
<!--                                        <v-btn text color="error" @click="modal = false">Cancel</v-btn>-->
<!--                                        <v-btn text color="primary" @click="$refs.dialogCalendar.save(expirationDate)">OK</v-btn>-->
<!--                                    </v-date-picker>-->
<!--                                </v-dialog>-->
<!--                            </v-card-text>-->
<!--                        </v-card>-->
<!--                    </v-col>-->
<!--                </v-row>-->
                <v-row justify="space-between" class="mt-3">
                    <v-col>
                        <StudentsTable @serverError="onServerError"></StudentsTable>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import StudentsTable from "../components/StudentsTable";
    export default {
        name: "TheStudents",
        components: {StudentsTable},
        data() {
            return {
                // modal: false,
                // expirationDate: new Date().toISOString().substr(0, 10)
            };
        },
        methods: {
            onServerError(errorMessage) {
                this.$emit('serverError', errorMessage);
            }
        }
    }
</script>

<style scoped>
    #students-container {
        background-color: #F5F5F5;
    }
</style>