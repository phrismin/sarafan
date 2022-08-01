function getIndex(list, id) {
    for (let i = 0; i < list.length; i++) {
        if (list[i] === id) {
            return i;
        }
    }
    return -1;
}

let messageApi = Vue.resource('/message{/id}');

Vue.component('message-form', {
    props: ['messages', 'messagesAttr'],
    data: function () {
        return {
            text: '',
            id: ''
        }
    },
    watch: {
        messageAttr: function(newValue, oldValue) {
            this.id = newValue.id;
            this.text = newValue.text;
        }
    },
    template:
        '<div>' +
            '<input type="text" placeholder="Write something" v-model="text" />' +
            '<input type="button" placeholder="Save" @click="save" value="Save"/>' +
        '</div',
    methods: {
        save: function () {
            let message = { text: this.text };

            if (this.id) {
                messageApi.update({id: this.id}, message).then(result =>
                        result.json().then(data => {
                                let index = getIndex(this.messages, data.id);
                                this.messages.splice(index, 1, data);
                                this.text = '';
                                this.id = '';
                            }
                        )
                    )
            } else {
                messageApi.save({}, message).then(result =>
                        result.json().then(data =>
                            this.messages.push(data)
                        )
                    )
                this.text = ''
            }
        }
    }
});

Vue.component('message-row', {
    props: ['message', 'editMethod'],
    template: '<div>' +
        '<i>({{ message.id }})</i> {{ message.text }}' +
            '<span>' +
                '<input type="button" value="Edit" @click="edit" />' +
            '</span>' +
        '</div>',
    methods: {
        edit: function () {
            this.editMethod(this.message);
        }
    }
});

Vue.component('messages-list', {
    props: ['messages'],
    data: function () {
        return {
            message: null
        }
    },
    template:
        '<div>' +
            '<message-form :messagesAttr="messages" />' +
            '<message-row v-for="message in messages" ' +
                'v-bind:key="message.id" ' +
                ':message="message" ' +
                ':editMessage="editMethod" />' +
        '</div>',
    created: function () {
        messageApi.get().then(result =>
                result.json().then(data =>
                    data.forEach(message =>
                        this.messages.push(message)
                    )
                )
            )
    },
    methods: {
        editMethod: function (message) {
            this.message = message;
        }
    }
});

let app = new Vue({
    el: '#app',
    template: '<messages-list :messages="messages"/>',
    data: {
        messages: []
    }
});