let messageApi = Vue.resource('/message{/id}');

Vue.component('message-row', {
    props: ['message'],
    template: '<div><i>({{ message.id }})</i> {{ message.text }}</div>'
})

Vue.component('messages-list', {
    props: ['messages'],
    template:
        '<div>' +
            '<message-row v-for="message in messages" v-bind:key="message.id" :message="message">' +
        '</div>',
    created: function () {
        messageApi.get()
            .then(result => result.json()
            .then(data => data.forEach(message => this.messages.push(message)
                )
            )
            )
    }
});

let app = new Vue({
    el: '#app',
    template: '<messages-list :messages="messages"/>',
    data: {
        messages: []
    }
});