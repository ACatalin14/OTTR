<template>
    <v-app id="ottr-app">
        <v-dialog
            v-model="serverErrorDialog"
            @keydown="serverErrorDialog = false"
            width="300"
        >
            <v-card>
                <v-card-title class="headline mb-1">
                    <v-icon color="error" class="mr-2">mdi-alert</v-icon>
                    <strong>{{ serverErrorTitle }}</strong>
                </v-card-title>
                <v-card-text class="body-1 py-0"> {{ serverErrorMessage }}</v-card-text>
                <v-card-actions class="pa-0 ma-0">
                    <v-spacer></v-spacer>
                    <v-btn
                        color="error"
                        class="pa-0 mr-2 mb-2"
                        text
                        @click="serverErrorDialog = false"
                    >
                        OK
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-app-bar
            :clipped-left="$vuetify.breakpoint.lgAndUp"
            app
            color="secondary"
            height="85"
            style="z-index: 100"
        >
            <v-row no-gutters align="center">
                <v-col cols="4" class="ma-0 pa-0">
                    <v-row no-gutters align="center">
                        <v-btn class="hidden-sm-and-down mx-0 pl-2" color="primary" @click.stop="drawer = !drawer" >
                            <v-icon v-show="drawer">mdi-chevron-left</v-icon>
                            <v-icon v-show="!drawer">mdi-chevron-down</v-icon>
                            <span class="ml-1 text-capitalize title"> Menu </span>
                        </v-btn>
                        <v-btn icon class="hidden-md-and-up" color="primary" @click.stop="drawer = !drawer" >
                            <v-icon>$menu</v-icon>
                        </v-btn>
                    </v-row>
                </v-col>
                <v-col cols="4">
                    <v-row no-gutters justify="center" align="center">
                        <router-link to="/">
                            <v-img
                                :src="require('@/assets/ottr-logo-blue.png')"
                                class=""
                                alt="Online Train Ticket Reservation"
                                max-height="74"
                                max-width="208"
                                transition="scale-transition"
                            />
                        </router-link>
                    </v-row>
                </v-col>
                <v-col cols="4" class="ma-0 pa-0">
                    <v-row no-gutters justify="end">
                        <v-btn
                            color="primary"
                            class="ml-4 pl-3 text-capitalize title hidden-sm-and-down"
                            v-if="userIsGuest"
                            to="/register"
                        >
                            <v-icon size="large">mdi-account-plus</v-icon>
                            <span class="ml-2 text-capitalize title"> Register </span>
                        </v-btn>
                        <v-btn
                            color="primary"
                            v-show="userIsGuest"
                            class="mx-4 pl-3 text-capitalize title hidden-sm-and-down"
                            to="/login"
                        >
                            <v-icon size="large">mdi-login</v-icon>
                            <span class="ml-2 text-capitalize title"> Login </span>
                        </v-btn>
                        <v-menu
                            v-model="valueOfDrobdownAppBar"
                            close-on-click
                            close-on-content-click
                            offset-y
                            class="ml-auto my-auto"
                        >
                            <template v-slot:activator="{ on }">
                                <v-btn
                                    color="primary"
                                    dark
                                    :icon="$vuetify.breakpoint.smAndDown"
                                    v-on="on"
                                    :hidden="userIsGuest"
                                >
                                    <span class="text-capitalize subtitle-1 hidden-sm-and-down" style="text-transform: none !important;">
                                        Welcome, {{ $store.getters.getUser.username  }}
                                        <v-icon class="ml-1 mb-1 py-auto" size="medium">mdi-arrow-down-drop-circle-outline</v-icon>
                                    </span>
                                    <v-icon class="hidden-md-and-up">mdi-dots-vertical</v-icon>
                                </v-btn>
                            </template>

                            <v-list class="py-1">
                                <v-list-item
                                    v-for="(item, index) in dropDownAppBarItems"
                                    :key="index"
                                    @click="logoutWhenRequested(item)"
                                    :to="item.route"
                                >
                                    <v-icon color="primary">{{ item.icon }}</v-icon>
                                    <v-list-item-title class="ml-2">{{ item.title }}</v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </v-row>
                </v-col>
            </v-row>
        </v-app-bar>
        <v-navigation-drawer
            v-model="drawer"
            :clipped="$vuetify.breakpoint.lgAndUp"
            color="primary"
            app
            dark
        >
            <v-list>
                <template v-for="item in menuItems">
                    <v-row
                        v-if="item.heading && shouldDisplayForUserGroup(item.displayForUserGroup) && shouldDisplayForScreenSize(item.displayForScreenSize)"
                        :key="item.heading"
                        align="center"
                    >
                        <v-subheader class="ml-3">
                            {{ item.heading }}
                        </v-subheader>
                    </v-row>
                    <v-list-group color="secondary"
                        v-else-if="item.children && shouldDisplayForUserGroup(item.displayForUserGroup) && shouldDisplayForScreenSize(item.displayForScreenSize)"
                        :key="item.text"
                        v-model="item.model"
                        :prepend-icon="item.model ? item.icon : item['icon-alt']"
                        append-icon=""
                    >
                        <template v-slot:activator>
                            <v-list-item-content>
                                <v-list-item-title class="subtitle-1">
                                    {{ item.text }}
                                </v-list-item-title>
                            </v-list-item-content>
                        </template>
                        <v-list-item
                            v-for="(child, i) in item.children"
                            :key="i"
                            link
                            :to="child.route"
                            class="ml-5"
                        >
                            <v-list-item-action v-if="child.icon">
                                <v-icon>{{ child.icon }}</v-icon>
                            </v-list-item-action>
                            <v-list-item-content>
                                <v-list-item-title class="subtitle-2">
                                    {{ child.text }}
                                </v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list-group>
                    <v-list-item
                        v-else-if="item.text && shouldDisplayForUserGroup(item.displayForUserGroup) && shouldDisplayForScreenSize(item.displayForScreenSize)"
                        :key="item.text"
                        link
                        :to="item.route"
                        @click="logoutWhenRequested(item)"
                    >
                        <v-list-item-action>
                            <v-icon>{{ item.icon }}</v-icon>
                        </v-list-item-action>
                        <v-list-item-content>
                            <v-list-item-title class="subtitle-1">
                                {{ item.text }}
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </template>
            </v-list>
        </v-navigation-drawer>
        <v-content app id="content">
            <router-view @serverError="onServerError"></router-view>
        </v-content>
        <v-footer app style="position: absolute" inset color="#E9E9E9" class="flex-column">
            <v-row>
                <strong>Copyright © 2020 - Now | Catalin-Gabriel Anastasiu
                    (<a href="mailto:catalinanastas@gmail.com">catalinanastas@gmail.com</a>).
                    More details <router-link to="/copyrights">here</router-link>.
                </strong>
            </v-row>
        </v-footer>
    </v-app>
</template>

<script>
    import CONSTANTS from "./constants";

    export default {
        props: {
            source: String,
        },
        data: () => ({
            serverErrorDialog: false,
            serverErrorMessage: '',
            serverErrorTitle: 'Server Error',
            drawer: null,
            valueOfDrobdownAppBar: false,
            dropDownAppBarItems: [
                { title: 'My Account', icon: 'mdi-account-circle', route: '/my-account' },
                { title: 'Log Out', icon: 'mdi-power', route: '', isLogout: true }
            ],
            menuItems: [
                { heading: 'Account', displayForScreenSize: 'smAndDown' },
                { icon: 'mdi-account-plus', text: 'Register', route: '/register', displayForUserGroup: CONSTANTS.USER_GROUPS.UNAUTHENTICATED, displayForScreenSize: 'smAndDown' },
                { icon: 'mdi-login', text: 'Login', route: '/login', displayForUserGroup: CONSTANTS.USER_GROUPS.UNAUTHENTICATED, displayForScreenSize: 'smAndDown' },
                { icon: 'mdi-account', text: 'My Account', route: '/my-account', displayForUserGroup: CONSTANTS.USER_GROUPS.AUTHENTICATED, displayForScreenSize: 'smAndDown' },
                { icon: 'mdi-power', text: 'Logout', route: '', displayForUserGroup: CONSTANTS.USER_GROUPS.AUTHENTICATED, displayForScreenSize: 'smAndDown', isLogout: true },
                { heading: 'General' },
                { icon: 'mdi-home', text: 'Home', route: '/' },
                { icon: 'mdi-account', text: 'My Account', route: '/my-account', displayForUserGroup: CONSTANTS.USER_GROUPS.AUTHENTICATED, displayForScreenSize: 'mdAndUp' },
                { icon: 'mdi-chart-areaspline', text: 'Dashboard', route: '/dashboard', displayForUserGroup: CONSTANTS.USER_GROUPS.ADMIN_ONLY },
                { icon: 'mdi-ticket', text: 'My Tickets', route: '/my-tickets', displayForUserGroup: CONSTANTS.USER_GROUPS.AUTHENTICATED },
                {
                    icon: 'mdi-chevron-up',
                    'icon-alt': 'mdi-chevron-down',
                    text: 'Railway Management',
                    model: false,
                    displayForUserGroup: CONSTANTS.USER_GROUPS.ADMIN_ONLY,
                    children: [
                        { icon: 'mdi-road-variant', text: 'Routes', route: '/railway-management/routes' },
                        { icon: 'mdi-draw', text: 'Car Layouts', route: '/railway-management/car-layouts' },
                        { icon: 'mdi-cog', text: 'Miscellaneous', route: '/railway-management/miscellaneous' },
                    ],
                },
                // {
                //     icon: 'mdi-chevron-up',
                //     'icon-alt': 'mdi-chevron-down',
                //     text: 'Users Management',
                //     model: false,
                //     displayForUserGroup: CONSTANTS.USER_GROUPS.ADMIN_ONLY,
                //     children: [
                //         { icon: 'mdi-account-group', text: 'OTTR Users', route: '/users-management/ottr-users' },
                //         { icon: 'mdi-school', text: 'Students', route: '/users-management/students' },
                //     ],
                // },
                // {
                //     icon: 'mdi-chevron-up',
                //     'icon-alt': 'mdi-chevron-down',
                //     text: 'Trains Schedule',
                //     model: false,
                //     children: [
                //         { icon: 'mdi-train', text: 'My Train', route: '/trains-schedule/my-train' },
                //         { icon: 'mdi-clock-outline', text: 'Departures / Arrivals Station', route: '/trains-schedule/departures-arrivals-station' },
                //     ],
                // },
                // { icon: 'mdi-image-multiple', text: 'Gallery', route: '/gallery' },
                // { icon: 'mdi-email', text: 'Contact', route: '/contact' },
            ],
        }),
        computed: {
            userRole: function() {
                if (this.$store.getters.isLoggedIn) {
                    return this.$store.getters.getUser.role;
                }
                return CONSTANTS.USER_ROLES.GUEST;
            },

            userIsGuest: function() {
                return this.userRole === CONSTANTS.USER_ROLES.GUEST;
            }
        },
        methods: {
            shouldDisplayForUserGroup(displayGroup) {

                if (!displayGroup) {
                    return true;
                }

                if (!Array.isArray(displayGroup)) {
                    console.error('displayGroup is not an Array!');
                    throw DOMException('displayGroup is not an Array!');
                }

                return displayGroup.includes(this.userRole);
            },

            shouldDisplayForScreenSize(displayScreenSize) {
                if (!displayScreenSize) {
                    return true;
                }

                const currentDisplay = this.$vuetify.breakpoint.name;

                switch (displayScreenSize) {
                    case 'mdAndUp':
                        if (['md', 'lg', 'xl'].includes(currentDisplay)) {
                            return true;
                        }
                        break;
                    case 'mdAndDown':
                        if (['xs', 'sm', 'md'].includes(currentDisplay)) {
                            return true;
                        }
                        break;
                    case 'smAndDown':
                        if (['xs', 'sm'].includes(currentDisplay)) {
                            return true;
                        }
                        break;
                    default:
                        console.error('displayScreenSize has abeen given an invalid value!');
                        throw DOMException('displayScreenSize has abeen given an invalid value!');
                }

                return false;
            },

            onServerError(errorMessage, errorTitle) {
                this.serverErrorDialog = true;
                this.serverErrorMessage = errorMessage;
                this.serverErrorTitle = errorTitle ? errorTitle : 'Server Error';
            },

            logoutWhenRequested(dropdownMenuItem) {
                if (dropdownMenuItem.isLogout) {
                    this.$store.dispatch('logout');
                    this.$router.push('/');
                }
            }
        }
    }
</script>

<style>
    #ottr-app {
        background-color: #E9E9E9;
        min-height: 100vh;
    }
    a {
        text-decoration: none
    }
    /*#content {*/
    /*    min-height: calc(100% - 74px);*/
    /*}*/
</style>