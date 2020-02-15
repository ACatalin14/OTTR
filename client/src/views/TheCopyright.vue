<template>
    <v-container fluid class="fill-height ma-0 px-7 pt-7 pb-1 ">
        <v-row id="copyright-container" class="fill-height ma-0 pa-0">
            <v-col class="pa-6 pt-5">
                <h1 class="headline font-weight-black mb-4 pa-0">Copyrights Details</h1>
                <v-divider></v-divider>
                <v-row class="ma-0 mt-5 body-1">
                    <p>
                        This is a Bachelor thesis, made for non-commercial use! All that can be seen on this website
                        is of fictional kind, and any image found on this domain has been made by the author himself or
                        has been carefully selected to be used as it is or modified in order to satisfy the
                        project's requirements.
                    </p>
                    <p>
                        Down below you can find a list with resources gathered from around the Internet, resources made
                        publicly available and labeled for noncommercial reuse (with or without modification).
                    </p>
                    <ul>
                        <li>https://www.logolynx.com/topic/otter#&gid=1&pid=15</li>
                        <li>https://commons.wikimedia.org/wiki/File:Otter_Logo.jpg</li>
                        <li>https://svgsilh.com/image/303792.html</li>
                    </ul>
                </v-row>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    export default {
        name: "TheCopyright"
    }
</script>

<style>
#copyright-container {
    background-color: #F5F5F5;
}
</style>