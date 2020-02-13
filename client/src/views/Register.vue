<template>
    <v-container fluid class="fill-height">
        <v-row justify="center" align="center" class="fill-height mx-0">
            <v-col cols="12" md="6">
                <v-card style="border-top: solid 4px indigo">
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

                            <v-text-field
                                v-model="passwordRepeat"
                                :rules="passwordRepeatRules"
                                label="Repeat Password"
                                color="primary"
                                placeholder="Enter same password"
                                :append-icon="showPasswordRepeat ? 'mdi-eye' : 'mdi-eye-off'"
                                :type="showPasswordRepeat ? 'text' : 'password'"
                                @click:append="showPasswordRepeat = !showPasswordRepeat"
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
                password: '',
                passwordRepeat: '',
                showPassword: false,
                showPasswordRepeat: false,
                usernameRules: [
                    name => !!name || 'Username is required',
                    name => name.length >= 3 || 'Username must have at least 3 characters'
                ],
                emailRules: [
                    email => !!email || 'E-mail is required',
                    email =>  /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email) || 'E-mail is invalid'
                ],
                passwordRules: [
                    password => !!password || 'Password is required',
                    password => password.length >= 6 || 'Password must have at least 6 characters'
                ],
                passwordRepeatRules: [
                    passwordRep => !!passwordRep || 'Password confirmation is required',
                    passwordRep => passwordRep === this.password || 'Passwords must match',
                    passwordRep => passwordRep.length >= 6 || 'Password must have at least 6 characters',
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
                        password: this.password,
                        passwordRepeat: this.passwordRepeat,
                        role: CONSTANTS.USER_ROLES.USER
                    };
                    const response = await AuthService.register(credentials);

                    await this.$store.dispatch('login', { token: response.token, user: response.user });

                    await this.$router.push('/');

                } catch (error) {
                    this.$emit('serverError', error.response.data.err.message)
                }
            },
            validateForm() {
                return this.$refs.registerForm.validate();
            }
        },
        computed: {
            // usernameRules() {
            //     const rules = [];
            //
            //     rules.push(name => !!name || 'Username is required');
            //     rules.push(name => (name || '').indexOf(' ') < 0 || 'No spaces are allowed');
            //
            //     return rules;
            // },
            // emailRules() {
            //     const rules = [];
            //
            //     rules.push(email => !!email || 'Email is required');
            //     rules.push(email =>  /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email) || 'Email is invalid');
            //
            //     return rules;
            // },
            // passwordRules() {
            //     const rules = [];
            //
            //     return rules;
            // },
            // passwordRepeatRules() {
            //     const rules = [];
            //
            //     return rules;
            // }
        }
    };
</script>