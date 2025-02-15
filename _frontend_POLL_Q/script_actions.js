import Language from "./script_language.js";
import App from "./script_app.js";
import Slide from "./script_slide.js";

const Actions = {

    load() {

        let tx = '';

        tx += `<div class="actions-row">`

        tx += `<div class="actions-items">`
        tx += `<div id="select-question"><select onchange="question_select(this.value)">`;
        App.obj.questions.forEach((q, i) => {
            tx += `<option  value="${i}" ${App.obj.question == i ? 'selected' : ''}>`;
            tx += q.command;
            tx += `</option>`;
        });
        tx += `</select></div>`;
        tx += `<div class="action-button" onclick="action_question('q_edit')"><i class="fa-solid fa-pen-to-square"></i></div>`;
        tx += `</div>`;

        tx += `<div class="actions-items">`
        tx += `<div class="action-info" id="action-info-responses"></div>`;
        tx += `<div class="action-button" onclick="action_exec('q_results')"><i class="fa-solid fa-chart-simple"></i></div>`;
        tx += `<div class="action-button" onclick="action_exec('q_insights')"><img src="images/aiBlack.png" width="15"></div>`;
        tx += `<div class="action-button" onclick="action_exec('q_clean')"><i class="fa-solid fa-trash"></i></div>`;
        tx += `</div>`;

        tx += `</div>`;

        Z.html('#actions', tx);

        //https://davidshimjs.github.io/qrcodejs/
        Z.html('#slide-qrcode', '');
        const roomUrl = `https://solvertank.tech/solverpoll/r/?room=${App.obj.room}`
        console.log(roomUrl);
        const qrcode = new QRCode(Z.get('slide-qrcode'), {
            text: roomUrl,
            correctLevel: QRCode.CorrectLevel.H
        });

        this.questionSelect(App.obj.question);

    },

    questionSelect(i) {

        App.obj.question = i;
        App.storageSet();
        const type = App.obj.questions[i].type;
        let meta = '';
        if (type === 'quiz') {
            meta = App.obj.questions[i].options.filter(o => o !== '').length;
        }

        const body = {
            proc: 'q_update',
            room: App.obj.room,
            user: App.obj.user,
            type: type,
            meta: meta,
            item: App.obj.question,
        };

        Z.processing.show();
        fetch(App.apiPath, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        })
            .then(response => response.json())
            .then(() => {
                Z.processing.hide();
                Slide.load();
            })
            .catch(error => {
                Z.processing.hide();
                console.error('Error:', error);
            });
    },

    infos() {
        //Z.html('#slide-room', App.obj.room); // disabled, use for debug purposes only
        Z.html('#action-info-responses', `${Language.get('Respostas')}: ${App.responses}`);
    },

    roomUpdate() {
        return; // disabled, use for debug purposes only
        const room = prompt(Language.get('Informe o código da sala'), App.obj.room);
        if (room === null) return;
        App.obj.room = room;
        App.storageSet();
        Actions.load();
    },

    exec(op) {

        if (op === 'q_insights') {
            if (App.responses > 9) {
                if (App.obj.context) {
                    Actions.getInsights();
                } else {
                    alert(Language.get('Para obter AI insights é necessário informar o contexto geral e das perguntas.'));}
            } else {
                alert(Language.get('Para obter AI insights é necessário ter ao menos 10 respostas.'));
            }
            return;
        }

        // Prepare body to post
        const body = {};
        body.proc = op;
        body.room = App.obj.room;
        body.user = App.obj.user;
        body.item = App.obj.question;
        if (op === 'q_clean') {
            if (!confirm(Language.get('Tem certeza que deseja limpar as respostas?'))) return;
            clearInterval(Slide.interval);
        } else if (op === 'q_clean_no_confirmation') {
            op = 'q_clean';
            clearInterval(Slide.interval);
        } else if (op === 'q_results') {
            clearInterval(Slide.interval);
        }

        // Post
        fetch(App.apiPath, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        })
            .then(response => response.json())
            .then(result => {
                if (op === 'q_responses') {
                    App.responses = result.data.responses || 0;
                } else if (op === 'q_results') {
                    App.obj.questions[App.obj.question].results = result.data;
                    Slide.chart(result.data);
                } else if (op === 'q_clean') {
                    console.log(result);
                    App.responses = 0;
                    Slide.load();
                }
                Actions.infos();
            })
            .catch((error) => {
                console.error('Error:', error);
            });

    },

    question(op) {
        if (op === 'q_edit') {
            Slide.edit();
        } else {
            console.log(op)
        }
    },

    getInsights() {
        
        const body = {
            language: App.obj.language,
            context: App.obj.context,
            question: App.obj.question,
            questions: App.obj.questions,
            previous: App.obj.previous,
        };
        //console.log(body);

        Z.processing.show();
        fetch(App.apiAIPath + 'q_insights/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        })
            .then(response => response.json())
            .then(result => {
                //console.log(result);
                Z.processing.hide();
                let tx = '';
                tx += result.comment;
                tx = marked.parse(tx); // https://github.com/markedjs/marked
                tx = tx.replace(/<a /g, '<a target="_blank" ');
                tx = `<div class="insights">${tx}</div>`;
                tx += `<div class="button" onclick="refresh_insights()"><i class="fa-solid fa-arrows-rotate"></i></div>`;
                Z.modal('Insights', tx);
                
            })
            .catch(error => {
                Z.processing.hide();
                console.error('Error:', error);
            });
    },

    refreshInsights() {
        Z.modalHide();
        Actions.getInsights();
    },

}

export default Actions;

