<template>
    <v-app id="ottr-app">
        <v-app-bar
            :clipped-left="$vuetify.breakpoint.lgAndUp"
            app
            color="secondary"
            height="85"
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
                                :src="require('@/assets/ottr-logo.png')"
                                class=""
                                alt="Online Train Ticket Reservation"
                                contain
                                max-height="94%"
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
                            to="register"
                        >
                            <v-icon size="large">mdi-account-plus</v-icon>
                            <span class="ml-2 text-capitalize title"> Register </span>
                        </v-btn>
                        <v-btn
                            color="primary"
                            v-if="userIsGuest"
                            class="mx-4 pl-3 text-capitalize title hidden-sm-and-down"
                            to="login"
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
                                    <span class="text-capitalize subtitle-1 hidden-sm-and-down">
                                        Welcome, Anastasiu Catalin
                                        <v-icon class="ml-1 mb-1 py-auto" size="medium">mdi-arrow-down-drop-circle-outline</v-icon>
                                    </span>
                                    <v-icon class="hidden-md-and-up">mdi-dots-vertical</v-icon>
                                </v-btn>
                            </template>

                            <v-list>
                                <v-list-item
                                    v-for="(item, index) in dropDownAppBarItems"
                                    :key="index"
                                    @click=""
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
                <template v-for="item in items">
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
        <v-content>
            <v-container
                class="fill-height"
                fluid
            >
                <router-view></router-view>
            </v-container>
        </v-content>
        <v-footer app style="position: absolute" inset color="black" dark class="flex-column">
            <v-row>
                Copyright © 2020 - Now | Catalin-Gabriel Anastasiu (e-mail: catalinanastas@gmail.com)
            </v-row>
            <v-row>
                This is a Bachelor thesis, made for non-commercial use! All that can be seen on this website is of fictional kind.
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
            dialog: false,
            drawer: null,
            valueOfDrobdownAppBar: false,
            userRole: CONSTANTS.USER_ROLES.ADMIN,
            dropDownAppBarItems: [
                { title: 'My Account', icon: 'mdi-account-circle', route: '/user/id' },
                { title: 'Log Out', icon: 'mdi-power', route: '/' }

            ],
            items: [
                { heading: 'Account', displayForUserGroup: CONSTANTS.USER_GROUPS.GUEST_ONLY, displayForScreenSize: 'smAndDown' },
                { icon: 'mdi-account-plus', text: 'Register', route: '', displayForUserGroup: CONSTANTS.USER_GROUPS.GUEST_ONLY, displayForScreenSize: 'smAndDown' },
                { icon: 'mdi-login', text: 'Login', route: '', displayForUserGroup: CONSTANTS.USER_GROUPS.GUEST_ONLY, displayForScreenSize: 'smAndDown' },
                { heading: 'General' },
                { icon: 'mdi-home', text: 'Home', route: '/' },
                { icon: 'mdi-account', text: 'My Account', route: '', displayForUserGroup: CONSTANTS.USER_GROUPS.AUTHENTICATED },
                { icon: 'mdi-chart-areaspline', text: 'Dashboard', route: '', displayForUserGroup: CONSTANTS.USER_GROUPS.ADMIN_ONLY },

                { icon: 'mdi-ticket', text: 'My Tickets', route: '', displayForUserGroup: CONSTANTS.USER_GROUPS.AUTHENTICATED },
                {
                    icon: 'mdi-chevron-up',
                    'icon-alt': 'mdi-chevron-down',
                    text: 'Railway Management',
                    model: false,
                    displayForUserGroup: CONSTANTS.USER_GROUPS.ADMIN_ONLY,
                    children: [
                        { icon: 'mdi-road-variant', text: 'Routes', route: '' },
                        { icon: 'mdi-draw', text: 'Car Canvas', route: '' },
                        { icon: 'mdi-settings', text: 'Miscellaneous', route: '' },
                    ],
                },
                {
                    icon: 'mdi-chevron-up',
                    'icon-alt': 'mdi-chevron-down',
                    text: 'Trains Schedule',
                    model: false,
                    children: [
                        { icon: 'mdi-train', text: 'My Train', route: '' },
                        { icon: 'mdi-clock-outline', text: 'Departures / Arrivals Station', route: '' },
                    ],
                },
                { icon: 'mdi-image-multiple', text: 'Gallery', route: '' },
                { icon: 'mdi-email', text: 'Contact', route: '' },
            ],
        }),
        computed: {
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
            }

        }
    }
</script>