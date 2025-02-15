import App from './script_app.js';
const Room = {

    id: '',
    status: 0,
    type: '',
    meta: '',


    // Get room from URL or prompt
    getId() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        let room = urlParams.get('room');
        if (room === null) {
            room = prompt('Enter room');
        }
        if (room != null || room.trim() != '') {
            this.id = room;
        }
    },

    // Load room data
    load() {
        const data = {
            room: this.id,
            proc: 'r_status'
        };
        Z.processing.show();
        fetch(App.apiPath, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
            .then(result => {
                Z.processing.hide();
                if (result.statusCode === 400) {
                    App.error(result.data);
                } else {
                    this.status = result.data.status;
                    this.type = result.data.type;
                    this.meta = result.data.meta;
                    this.show();
                }
            })
            .catch((error) => {
                Z.processing.hide();
                App.error(error);
            });

    },

    // Show room data
    show() {
        Z.hide('.all-div');
        if (this.status != 1) {
            Z.show('#start');
        } else {
            if (this.type === 'quiz') {
                Z.show('#quiz');
                if (this.meta < 5) Z.hide('#quiz-answer-4');
                if (this.meta < 4) Z.hide('#quiz-answer-3');
                if (this.meta < 3) Z.hide('#quiz-answer-2');
            } else if (this.type === 'tag' || this.type === 'post') {
                Z.show('#tagpost');
            }
        }

    },

    start() {
        Room.load(true)
    },

    response(op, div='#quiz') {
        const data = {
            user: App.user,
            room: Room.id,
            response: op,
            proc: 'r_response',
        };
        Z.processing.show();
        fetch(App.apiPath, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
            .then(result => {
                Z.processing.hide();
                if (result.statusCode === 400) {
                    if (result.data.includes('Duplicate entry')) {
                        App.error('You have already responded');
                    } else {
                        App.error(result.data);
                    }
                } else {
                    Z.html(div, '<img style="margin-top:3rem;" width="100" src="thumbsup.png" alt="OK" />');
                }
            })
            .catch((error) => {
                Z.processing.hide();
                App.error(error);
            });
    
    },

    tagpostSubmit() {
        const text = Z.getInputTextArea('tagpost-text');
        if (text.trim() === '') {
            Z.error('Text is empty');
            return;
        }
        Room.response(text, '#tagpost');

       

    },

}

export default Room

