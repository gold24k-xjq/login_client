<template>
    <div id="app">
        <Header v-if="$route.name != 'Login'"></Header>
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive"/>
        </keep-alive>
            <router-view v-if="!$route.meta.keepAlive"/>
        <Footer></Footer>
    </div>
</template>

<script>

import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

export default {

    components: {
        Header,
        Footer
    },

}

</script>
