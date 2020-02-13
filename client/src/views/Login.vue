<template>
    <v-container fluid class="fill-height ma-0">
        <v-row justify="center" align="center" class="fill-height mx-0">
            <v-col cols="12" md="4">
                <v-card style="border-top: solid 4px indigo">
                    <v-card-title class="justify-center">
                        <p class="display-1">
                            Login
                        </p>
                    </v-card-title>
                    <v-card-text>
                        <v-form
                            ref="loginForm"
                            v-model="valid"
                            class="px-6"
                            lazy-validation
                            @submit.prevent="login"
                        >

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
                                placeholder="Enter your password"
                                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                :type="showPassword ? 'text' : 'password'"
                                @click:append="showPassword = !showPassword"
                            ></v-text-field>

                            <v-row justify="center">
                                <v-btn :disabled="!valid" color="primary" class="mt-2 px-7 text-capitalize" type="submit">
                                    Login Now
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
    export default {
        data() {
            return {
                valid: true,
                email: '',
                password: '',
                showPassword: false,
                emailRules: [
                    email => !!email || 'E-mail is required',
                    email =>  /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email) || 'E-mail is invalid'
                ],
                passwordRules: [
                    password => !!password || 'Password is required'
                ],
            };
        },
        methods: {
            async login() {
                try {
                    if (!this.validateForm()) {
                        this.valid = false;
                        return;
                    }
                    const credentials = {
                        email: this.email,
                        password: this.password
                    };
                    const response = await AuthService.login(credentials);
                    console.log(response);

                    const token = response.token;
                    const user = response.user;

                    await this.$store.dispatch('login', { token, user });

                    await this.$router.push('/');
                } catch (error) {
                    this.$emit('serverError', error.response.data.err.message)
                }
            },
            validateForm() {
                return this.$refs.loginForm.validate();
            }
        }
    };
</script>