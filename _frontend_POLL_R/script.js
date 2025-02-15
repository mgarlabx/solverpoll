import App from './script_app.js';
import Room from './script_room.js';

Z.ready(() => {
    App.load();
    Room.getId();
    if (Room.id === '') return;
    Room.load();
});

window.start = Room.start;
window.quiz_answer = Room.response;
window.tagpost_submit = Room.tagpostSubmit;




