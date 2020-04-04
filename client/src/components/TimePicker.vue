<template>
    <v-dialog
        ref="timePickerDialog"
        v-model="timePickerDialog"
        :return-value.sync="timePickerText"
        persistent
        width="290px"
    >
        <template v-slot:activator="{ on }">
            <v-text-field
                v-model="timePickerText"
                :label="label"
                prepend-icon="mdi-clock"
                readonly
                v-on="on"
                :rules="timePickerTextRules"
            ></v-text-field>
        </template>
        <v-time-picker
            v-if="timePickerDialog"
            v-model="timePickerText"
            full-width
        >
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="timePickerDialog = false">Cancel</v-btn>
            <v-btn text color="primary"
                   @click="$refs.timePickerDialog.save(timePickerText)"
            >
                OK
            </v-btn>
        </v-time-picker>
    </v-dialog>
</template>

<script>
    export default {
        name: "TimePicker",
        props: {
            name: String,
            initialValue: String,
            label: String,
            requiredMessage: String
        },
        data() {
            return {
                timePickerDialog: false,
                timePickerText: null,
                timePickerTextRules: []
            }
        },
        mounted() {
            this.timePickerTextRules.push(
                time => !!time || this.requiredMessage
            );

            if (this.initialValue && this.initialValue !== 'N/A') {
                this.timePickerText = this.initialValue;
            }
        },
        watch: {
            initialValue(newVal) {
                if (newVal && newVal !== 'N/A') {
                    this.timePickerText = newVal;
                } else {
                    this.timePickerText = null;
                }
            },

            timePickerText(newTime) {

                this.$emit('timePickerChanged', {
                    name: this.name,
                    newTime: newTime
                });
            }
        }
    }
</script>

<style scoped>

</style>