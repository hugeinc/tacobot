module.exports = {
    getHook: function (message, name, event) {
        return JSON.stringify({
            event: event || 'room_message',
            item: {
                message: {
                    date: '2015-01-20T22:45:06.662545+00:00',
                    from: {
                        id: '1661743',
                        'mention_name': 'Blinky',
                        name: name || 'Blinky the Three Eyed Fish'
                    },
                    id: '00a3eb7f-fac5-496a-8d64-a9050c712ca1',
                    mentions: [],
                    message: message || '/weather',
                    type: 'message'
                },
                room: {
                    id: '1147567',
                    name: 'The Weather Channel'
                }
            },
            'webhook_id': '578829'
        });
    }
};
