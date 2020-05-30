<template>
    <v-carousel
        :hide-delimiter-background="true"
        :hide-delimiters="false"
        :show-arrows-on-hover="true"
        :show-arrows="false"
        light
        delimiter-icon="mdi-minus"
        continuous
        style="margin: auto; max-width: 510px"
        height="533"
    >
        <v-carousel-item
            v-for="(ad, i) in ads"
            :key="i"
        >
            <v-card
                class="mt-9 px-9"
                max-width="500"
                style="margin: auto"
                height="493"
            >
                <v-row justify="center" no-gutters>
                    <v-col class="pa-0 ma-0">
                        <v-row justify="center">
                            <v-img
                                :src="require('@/assets/' + ad.imagePath)"
                                alt="Advertisement Image"
                                transition="slide-y-reverse-transition"
                                class="mt-n8 elevation-7"
                                style="border-radius: 15px;"
                            >
                            </v-img>
                        </v-row>
                        <v-row no-gutters class="ma-0 pa-0 mt-2">
                            <v-spacer></v-spacer>
                            <v-card-title :class="['pb-0', 'font-weight-bold', $vuetify.breakpoint.smAndUp ? 'title'
                            : 'subtitle-1']">
                                {{ ad.textTitle }}
                            </v-card-title>
                            <v-spacer></v-spacer>
                        </v-row>
                        <v-row no-gutters>
                            <v-spacer></v-spacer>
                            <v-card-text class="pt-2 text-center text--secondary">
                                <span v-html="ad.textDescription"></span>
                            </v-card-text>
                            <v-spacer></v-spacer>
                        </v-row>
                    </v-col>
                </v-row>
            </v-card>
        </v-carousel-item>
    </v-carousel>
</template>

<script>
    export default {
        name: "AdvertisementCarousel",
        data() {
            return {
                ads: [
                    {
                        imagePath: 'woman-traveling.png',
                        textTitle: 'Summer Travel',
                        textDescription: `This summer you too can enjoy the touristic attractions by traveling with our
                                seasonal discounts ranging from 5% to 30%. No matter where you are, you can
                                easily book a ride so you can choose your own seat (even next to the A/C during
                                this hot time, you'll enjoy it). For more details, check our <a href="offers"> offers page...</a>
                                <br><br>`
                    },
                    {
                        imagePath: 'bringing-people-together.png',
                        textTitle: 'Bringing People Together',
                        textDescription:
                            `Trains have always been known as a way to reunite people separated by long distances.
                             OTTR can give <strong>you</strong> the possibility to see your dearest friends and relatives
                             so you can enjoy more time with them. For this reason, you can join
                             <a href="bringing-people-together">our draw</a> and be the lucky one to benefit from a
                             free ride wherever your heart desires. All you have to do is to <a href="register">register</a>
                             on our website, isn't that simple?<br><br>`
                    },
                    {
                        imagePath: 'student-in-train.png',
                        textTitle: 'Student Discounts',
                        textDescription:
                            `<strong>Comming Soon</strong><br><br>Students will be able to book any ride for free in order to travel
                            in any place they wish. This is supported by our good government so that we can help our young
                            citizens to learn more about our country by exploring it without any limits.`
                    },
                ]
            }
        }
    }
</script>

<style scoped>

</style>