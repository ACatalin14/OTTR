<template>
    <v-container fluid class="fill-height">
        <v-row justify="center" align="center" class="fill-height mx-0">
            <v-col cols="12" md="6">
                <v-card style="border-top: solid 4px indigo" :loading="registeringAccount" loader-height="3">
                    <v-card-title class="justify-center">
                        <p class="display-1">
                            Create a new account
                        </p>
                    </v-card-title>
                    <v-card-text>
                        <v-form
                            ref="registerForm"
                            v-model="valid"
                            class="px-6"
                            lazy-validation
                            @submit.prevent="register"
                        >
                            <v-text-field
                                v-model="username"
                                :rules="usernameRules"
                                label="User Name"
                                color="primary"
                                placeholder="Enter a username"
                            ></v-text-field>

                            <v-text-field
                                v-model="email"
                                :rules="emailRules"
                                label="E-mail"
                                color="primary"
                                placeholder="Enter your e-mail"
                            ></v-text-field>

                            <vue-tel-input-vuetify
                                v-model="phone"
                                label="Phone Number"
                                :rules="phoneRules"
                                :inputOptions="{ showDialCode: true, tabindex: 0 }"
                                mode="international"
                                placeholder=""
                                :loading="!phoneCountriesAvailable"
                                :preferredCountries="['RO']"
                                @country-changed="phoneCountriesAvailable = true"
                            >
                            </vue-tel-input-vuetify>

                            <v-text-field
                                v-model="password"
                                :rules="passwordRules"
                                label="Password"
                                color="primary"
                                placeholder="Minimum 6 characters"
                                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                :type="showPassword ? 'text' : 'password'"
                                @click:append="showPassword = !showPassword"
                            ></v-text-field>

                            <v-row justify="center">
                                <v-btn :disabled="!valid" color="primary" class="mt-4 px-7 text-capitalize" type="submit">
                                    Register Now
                                </v-btn>
                            </v-row>
                        </v-form>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import AuthService from '../services/authService';
    import CONSTANTS from "../constants";

    export default {
        data() {
            return {
                valid: true,
                username: '',
                email: '',
                phone: null,
                password: '',
                showPassword: false,
                showPasswordRepeat: false,
                phoneCountriesAvailable: false,
                registeringAccount: false,
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
                    password => !!password || 'Password is required',
                    password => password.length >= 6 || 'Password must have at least 6 characters'
                ]
            };
        },
        methods: {
            async register() {
                try {
                    if (!this.validateForm()) {
                        this.valid = false;
                        return;
                    }
                    const credentials = {
                        username: this.username,
                        email: this.email,
                        phone: this.phone,
                        password: this.password,
                        role: CONSTANTS.USER_ROLES.USER
                    };

                    this.registeringAccount = true;

                    const response = await AuthService.register(credentials);

                    await this.$store.dispatch('login', { token: response.token, user: response.user });

                    await this.$router.push({ name: 'my-account' });

                } catch (error) {
                    this.$emit('serverError', error.response.data.err.message)
                }

                this.registeringAccount = false;
            },
            validateForm() {
                return this.$refs.registerForm.validate();
            }
        }
    };
</script>