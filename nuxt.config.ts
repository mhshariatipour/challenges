// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: ['@nuxtjs/tailwindcss'],

    app: {
        head: {
            title: "test",
            meta:[
                {name: "description", content: "Hi Bye"}
            ],
            link:[
                //
            ]
        },
    },

    build: {
        transpile: ['vue-toastification'],
    },

})
