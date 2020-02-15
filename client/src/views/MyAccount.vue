<template>
    <v-container fluid class="fill-height ma-0 px-7 pt-7 pb-1 ">
        <v-dialog
            v-model="editAccountDialog"
            persistent
            max-width="600"
        >
            <v-card>
                <v-card-title>
                    <span class="headline">Edit Account</span>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field
                                    v-model="editUsername"
                                    label="User Name"
                                    required
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field
                                    v-model="editEmail"
                                    label="Email"
                                    :rules="emailRules"
                                    required
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field
                                    v-model="editPhone"
                                    label="Email"
                                    :rules="phoneRules"
                                    required
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field label="New Password" type="password" required></v-text-field>
                            </v-col>
                        </v-row>

                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" text @click="editAccountDialog = false">Cancel</v-btn>
                    <v-btn color="primary" text @click="tryEditAccount()">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-row id="my-account-container" class="fill-height ma-0 pa-0">
            <v-col class="pa-6 pt-5">
<!--                <h1 class="headline font-weight-black mb-4 pa-0">My Account</h1>-->
<!--                <v-divider></v-divider>-->
<!--                <v-card class="ma-0 mt-5 d-block pa-5 pl-6">-->
                <v-card class="ma-0 d-block pa-5 pl-3">
                    <v-row class="ma-0 pa-0" no-gutters>
                        <v-col cols="auto" class="ma-0 pa-0 px-3" v-show="$vuetify.breakpoint.smAndUp">
                            <v-img
                                :src="require('@/assets/user-logo-man.png')"
                                alt="Error 404 Logo"
                                min-width="100"
                                max-width="200"
                            />
                        </v-col>
                        <v-col class="pa-0">
                            <v-row no-gutters justify="end" v-show="$vuetify.breakpoint.smAndUp">
                                <v-btn color="primary" class="text-capitalize body-1" @click="editAccountDialog = true">
                                    Edit Account
                                </v-btn>
                            </v-row>
                            <v-row no-gutters class="ml-1" align="center">
                                <v-col cols="auto">
                                    <v-card-title class="ma-0 pl-0 display-1 font-weight-black">
                                        <v-icon color="primary" class="mr-2 pt-1" large>mdi-account-circle</v-icon>
                                        <span>{{ user.username }}</span>
                                    </v-card-title>
                                </v-col>
                                <v-spacer v-if="$vuetify.breakpoint.xs"></v-spacer>
                                <v-col v-if="$vuetify.breakpoint.xs">
                                    <v-row justify="end" no-gutters>
                                        <v-icon color="primary" @click="editAccountDialog = true">mdi-pen</v-icon>
                                    </v-row>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-card>
                <v-row class="mt-8">
                    <v-col cols="12" md="6">
                        <SpecificUserInfoCard
                            icon-name="mdi-email"
                            property-title="Email"
                            :info-value="user.email"
                        ></SpecificUserInfoCard>
                        <SpecificUserInfoCard
                            icon-name="mdi-phone"
                            property-title="Phone"
                            :info-value="user.phone"
                            class="mt-5"
                        ></SpecificUserInfoCard>
<!--                        TODO: implement no of bought tickets for a user -->
<!--                        <SpecificUserInfoCard-->
<!--                            icon-name="mdi-ticket"-->
<!--                            property-title="Tickets Bought"-->
<!--                            :info-value="14"-->
<!--                            class="mt-5"-->
<!--                        ></SpecificUserInfoCard>-->
                    </v-col>
                    <v-col cols="12" md="6">
                        <SpecificUserInfoCard
                            icon-name="mdi-account"
                            property-title="User Type"
                            :info-value="userRoleString"
                        ></SpecificUserInfoCard>
                        <SpecificUserInfoCard
                            icon-name="mdi-calendar"
                            property-title="Registration Date"
                            :info-value="userRegistrationDate"
                            class="mt-5"
                        ></SpecificUserInfoCard>
                    </v-col>
                </v-row>
                <v-row justify="end" class="mt-6 mb-2" no-gutters>
                    <v-btn
                        color="error"
                        class="text-capitalize body-1"
                    >
                        Delete Account
                    </v-btn>
                </v-row>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import SpecificUserInfoCard from "../components/SpecificUserInfoCard";
    import CONSTANTS from "../constants";
    export default {
        name: "MyAccount",
        components: {SpecificUserInfoCard},
        data() {
            return {
                user: this.$store.getters.getUser,
                editAccountDialog: false,
                showEditSuccessBanner: false,
                editUsername: this.$store.getters.getUser.username,
                editEmail: this.$store.getters.getUser.email,
                editPhone: this.$store.getters.getUser.phone,
                emailRules: [
                    email => !!email || 'E-mail is required',
                    email =>  /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/g.test(email) || 'E-mail is invalid'
                ],
                phoneRules: [
                    phone => !!phone || 'Phone number is required',
                    phone =>  /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/g.test(phone) || 'Phone number is invalid'
                ]
            }
        },
        computed: {
            userRoleString() {
                switch (this.user.role) {
                    case CONSTANTS.USER_ROLES.ADMIN:
                        return 'Admin';
                    case CONSTANTS.USER_ROLES.USER:
                        return 'Regular User';
                    case CONSTANTS.USER_ROLES.GUEST:
                        // should be impossible for a guest to be on my-account page, but I guess you never know ¯\_(ツ)_/¯
                        return 'Guest';
                    default:
                        console.error('Unknown user role type ' + this.user.role + ' to display.');
                        throw DOMError('Unknown user role type to display.');
                }
            },
            userRegistrationDate() {
                const date = new Date(this.user.registered);
                return date.getDate() + '.' +
                    (date.toLocaleString('default', {month: '2-digit'})) + '.' +
                    date.getFullYear();
            }
        },
        methods: {
            tryEditAccount() {
                try {
                    // edit to server


                    this.editAccountDialog = false;
                    this.showEditSuccessBanner = true;
                } catch (error) {
                    this.$emit('serverError', error.response.data.err.message);
                }
            }
        }
    }
</script>

<style>
#my-account-container {
    background-color: #F5F5F5;
}
</style>