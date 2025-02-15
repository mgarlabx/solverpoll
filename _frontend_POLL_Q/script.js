import App from './script_app.js';
import Actions from './script_actions.js';
import Slide from './script_slide.js';

Z.ready(() => {
    App.load();
});

window.action_exec = Actions.exec;
window.action_question = Actions.question;
window.question_select = Actions.questionSelect;
window.actions_room_update = Actions.roomUpdate;
window.refresh_insights = Actions.refreshInsights;
window.slide_toggle = Slide.toggle;
window.slide_save = Slide.save;







