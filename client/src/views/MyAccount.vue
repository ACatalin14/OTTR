<template>
    <v-container fluid class="ma-0 px-7 pt-7 pb-1 ">
        <v-dialog
            v-model="editAccountDialog"
            persistent
            max-width="600"
        >
            <v-card>
                <v-form
                    v-model="editAccountFormValid"
                    ref="editAccountForm"
                    lazy-validation
                    @submit.prevent="editAccount"
                >
                    <v-card-title>
                        <span class="headline">Edit Account</span>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text class="px-7">
                        <v-container>
                            <v-row no-gutters>
                                <v-col cols="12">
                                    <v-text-field
                                        v-model="editUsername"
                                        label="User Name"
                                        :rules="usernameRules"
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
                                        label="Phone"
                                        :rules="phoneRules"
                                        required
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field
                                        v-model="editPassword"
                                        label="New Password"
                                        hint="Optional"
                                        persistent-hint
                                        :append-icon="showEditPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                        :type="showEditPassword ? 'text' : 'password'"
                                        @click:append="showEditPassword = !showEditPassword"
                                        :rules="passwordRules"
                                    ></v-text-field>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="error" text @click="changeEditAccountDialogVisibility()">Cancel</v-btn>
                        <v-btn color="primary" text :disabled="!editAccountFormValid" type="submit">Save</v-btn>
                    </v-card-actions>
                </v-form>
            </v-card>
        </v-dialog>
        <v-dialog
            v-model="deleteConfirmationDialog"
            @keydown="changeDeleteConfirmationDialogVisibility()"
            width="350"
        >
            <v-card>
                <v-card-title class="headline mb-1">
                    <v-icon color="error" class="mr-2">mdi-alert</v-icon>
                    <strong>Are you sure?</strong>
                </v-card-title>
                <v-card-text class="body-1 py-0">
                    Deleting your account will result in losing all data gathered so far. <br><br>
                    This will permanently erase your account.
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="changeDeleteConfirmationDialogVisibility()"> Cancel </v-btn>
                    <v-btn color="error" text @click="deleteAccount()"> Delete </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-alert
            v-model="notificationBanner"
            color="accent"
            elevation="2"
            icon="mdi-bell-outline"
            class="mb-5"
            border="left"
            colored-border
            dismissible
        >
            {{ notificationBannerMessage }}
        </v-alert>
        <v-row id="my-account-container" class="ma-0 pa-0">
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
                                <v-btn color="primary" class="text-capitalize body-1" @click="changeEditAccountDialogVisibility()">
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
                                        <v-icon color="primary" @click="changeEditAccountDialogVisibility()">mdi-pen</v-icon>
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
                        @click="changeDeleteConfirmationDialogVisibility()"
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
    import UserService from '../services/userService'

    export default {
        name: "MyAccount",
        components: {SpecificUserInfoCard},
        data() {
            return {
                editAccountDialog: false,
                editAccountFormValid: true,
                showEditPassword: false,
                notificationBanner: false,
                notificationBannerMessage: '',
                deleteConfirmationDialog: false,
                editUsername: this.$store.getters.getUser.username,
                editEmail: this.$store.getters.getUser.email,
                editPhone: this.$store.getters.getUser.phone,
                editPassword: '',
                usernameRules: [
                    name => !!name || 'Username is required',
                    name => name.length >= 3 || 'Username must have at least 3 characters'
                ],
                emailRules: [
                    email => !!email || 'E-mail is required',
                    email =>  /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/g.test(email) || 'E-mail is invalid'
                ],
                phoneRules: [
                    phone => !!phone || 'Phone number is required',
                    phone =>  /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/g.test(phone) || 'Phone number is invalid'
                ],
                passwordRules: [
                    password => !password || password.length >= 6 || 'New password must have at least 6 characters'
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
            },
            user() {
                return this.$store.getters.getUser;
            }
        },
        methods: {
            async editAccount() {
                try {
                    if (!this.$refs.editAccountForm.validate()) {
                        this.editAccountFormValid = false;
                        return;
                    }

                    const newUser = {
                        _id: this.user._id,
                        username: this.editUsername,
                        email: this.editEmail,
                        phone: this.editPhone,
                        password: this.editPassword
                    };

                    const response = await UserService.edit(newUser);

                    // Now we need to update the token
                    await this.$store.dispatch('login', { token: response.token, user: response.user });

                    this.editAccountDialog = false;
                    this.notificationBanner = true;
                    this.notificationBannerMessage = 'Account details have been succesfully updated.';
                } catch (error) {
                    this.$emit('serverError', error.response.data.err.message);
                }
            },

            changeEditAccountDialogVisibility() {
                this.editAccountDialog = !this.editAccountDialog;
                if (!this.editAccountDialog) {
                    // We closed the edit panel
                    return;
                }

                this.showEditPassword = false;
                this.editUsername = this.user.username;
                this.editEmail = this.user.email;
                this.editPhone = this.user.phone;
                this.editPassword = '';
            },

            changeDeleteConfirmationDialogVisibility() {
                this.deleteConfirmationDialog = !this.deleteConfirmationDialog;
            },

            async deleteAccount() {
                try {
                    await UserService.delete(this.user._id);
                    await this.$store.dispatch('logout');
                    await this.$router.push('/');
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