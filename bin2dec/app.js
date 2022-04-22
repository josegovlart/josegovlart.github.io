const app = Vue.createApp({
    data() {
        return {
            bin: '',
            dec: ''
        }
    },
    methods: {
        converseBin(bin) {
            let decimal = 0;
            for (let i = bin.length - 1; i >= 0; i--) {
                if (bin[i] == "1") {
                    decimal += Math.pow(2, Math.abs(i - bin.length) - 1);
                }
            }
            this.dec = decimal;
            return decimal;
        }
    },
});

app.mount('#app');