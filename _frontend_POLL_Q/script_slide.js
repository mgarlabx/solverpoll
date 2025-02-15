import Language from "./script_language.js";
import App from "./script_app.js";
import Actions from "./script_actions.js";

const Slide = {

    data: null,
    optionColors: ['#2481fb', '#3ab086', '#f5c42d', '#e43d5f', '#787992'],
    optionChars: ['A', 'B', 'C', 'D', 'E'],
    interval: null,

    load() {
        //Z.html('#slide-room', App.obj.room); // disabled, use for debug purposes only
        this.data = App.obj.questions[App.obj.question];

        Z.html('#slide-chart', '');
        Z.show('#slide-padlock');
        Z.show('#slide-qrcode');
        Z.hide('#slide-chart');
        clearInterval(Slide.interval);
        Actions.exec('q_close');
        Actions.exec('q_responses');

        if (this.data.type === 'quiz') {
            this.loadQuiz();
        } else if (this.data.type === 'tag' || this.data.type === 'post') {
            this.loadTagPost();
        }
    },

    loadQuiz() {
        let tx = '';
        tx += `<div class="quiz-options">`;
        this.data.options.forEach((option, index) => {
            if (option == '') return;
            tx += `<div class="quiz-option">`;
            tx += `<div class="quiz-char" style="background-color:${Slide.optionColors[index]}">${Slide.optionChars[index]}</div>`;
            tx += `<div class="quiz-text">${option}</div>`;
            tx += `</div>`;
        });
        tx += `</div>`;
        Z.html('#slide-left', tx);
        tx = `<div class="quiz-command">${this.data.command}</div>`;
        Z.html('#slide-command', tx);

    },

    loadTagPost() {
        let tx = '';
        tx += `<div class="tag-post-container"><div class="tag-post">${this.data.command}</div></div>`;
        Z.html('#slide-left', tx);
        Z.html('#slide-command', '&nbsp;');
    },


    toggle(op) {
        const body = {
            room: App.obj.room,
            user: App.obj.user,
        };
        if (op == 1) {
            Z.hide('#slide-padlock');
            body.proc = 'q_open';
            Slide.interval = setInterval(() => {
                Z.html('#action-info-responses', '');
                Actions.exec('q_responses')
            }, 1000);
        } else {
            Z.show('#slide-padlock');
            body.proc = 'q_close';
            clearInterval(Slide.interval);
        }
        fetch(App.apiPath, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        })
    },

    chart(results) {
        if (Z.get('#slide-chart').style.display == 'block' || Z.get('#slide-tag').style.display == 'block') {
            Z.hide('.slide-div');
            Slide.load();
            return;
        }

        Actions.exec('q_close');

        Z.hide('.slide-div');

        let tx = '';

        if (Slide.data.type == 'quiz') {
            const maxResponses = Math.max(...results.map(r => r.responses));
            this.data.options.forEach((option, index) => {
                let width = 0;
                let quantity = 0;
                if (maxResponses > 0) {
                    const responses = results.find(r => r.response == index);
                    if (responses) {
                        quantity = responses.responses;
                        width = Math.round((responses.responses / maxResponses) * 100);
                    }
                }
                tx += `<div class="slide-chart-bar" style="width:${width}%;background-color:${Slide.optionColors[index]}">&nbsp;&nbsp;${quantity}</div>`;
            });
            Z.html('#slide-chart', tx);
            Z.show('#slide-chart');

        } else if (Slide.data.type == 'tag') {
            Z.show('#slide-tag');
            const words = results.map(r => [r.response, r.responses]);
            const canvas = Z.get('slide-tag');
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            WordCloud(canvas, {
                list: words,
                gridSize: Math.round(window.innerWidth / 90),      // The size of the grid in pixels
                weightFactor: Math.round(window.innerWidth / 40),  // The size of the words
                fontFamily: 'Arial, sans-serif',
                color: 'random-dark',                   // Random color for each word
                rotateRatio: 0.5,                       // Rotation of words
                rotationSteps: 2,                       // Fewer rotation angles
                backgroundColor: '#fff'
            });

        } else if (Slide.data.type == 'post') {
            tx += `<div id="slide-chart-posts"><hr>`;
            tx += results.reduce((acc, cur) => acc + cur.response + '<hr>', '');
            tx += `</div>`;
            Z.html('#slide-chart', tx);
            Z.show('#slide-chart');

        }

    },

    edit() {
        const title = Language.get('Editar pergunta');
        let tx = '';
        tx += `<div class="edit-radios">`;
        tx += `<input type="radio" class="edit-radio" value="quiz" name="radio-type" ${this.data.type == 'quiz' ? ' checked' : ''}> Quiz`;
        tx += `<input type="radio" class="edit-radio" value="tag" name="radio-type" ${this.data.type == 'tag' ? ' checked' : ''}> Tag`;
        tx += `<input type="radio" class="edit-radio" value="post" name="radio-type" ${this.data.type == 'post' ? ' checked' : ''}> Post`;
        tx += `</div>`;
        tx += `<div><input id="quiz-edit-command" value="${this.data.command}"></div>`;
        tx += `<div class="quiz-options" style="width:100%">`;
        for (let index = 0; index < 5; index++) {
            const optionText = this.data.options[index] || '';
            tx += `<div class="quiz-option">`;
            tx += `<div class="quiz-char" style="background-color:${Slide.optionColors[index]}">${Slide.optionChars[index]}</div>`;
            tx += `<div class="quiz-text" style="width:100%"><input id="quiz-edit-option-${index}" class="quiz-edit-option" value="${optionText}"></div>`;
            tx += `</div>`;
        };
        tx += `</div><hr>`;
        tx += `<h3>${Language.get('Instruções para insights por IA')}</h3>`;
        tx += `<div class="quiz-context">${Language.get('Contexto geral:')}<br><textarea rows="5" class="quiz-textarea-context" id="quiz-edit-context-general">${App.obj.context || ''}</textarea></div>`;
        tx += `<div class="quiz-context">${Language.get('Contexto da questão:')}<br><textarea rows="5" class="quiz-textarea-context" id="quiz-edit-context">${this.data.context || ''}</textarea></div>`;
        
        if (App.obj.question > 0) {
            tx += `<div class="edit-checks"> ${Language.get('Questões anteriores a considerar:')} `;
            App.obj.questions.forEach((q, index) => {
                if (index < App.obj.question) {
                    let checked = '';
                    if (this.data.previous) {
                        if (this.data.previous[index]) {
                            checked = ' checked';
                        }
                    }
                    tx += `<div class="edit-check"><input class="quiz-edit-check" type="checkbox" value="${index + 1}" id="checkbox-${index + 1}"  ${checked}> ${index + 1}</div>`;

                }
            });
            tx += `</div>`;
        }

        tx += `<div class="button" onclick="slide_save()">${Language.get('Salvar')}</div>`;
        Z.modal(title, tx);

    },

    save() {
        const type = Z.getInputRadio('radio-type');
        const command = Z.getInputText('quiz-edit-command');
        const contextGeneral = Z.getInputTextarea('quiz-edit-context-general');
        const context = Z.getInputTextarea('quiz-edit-context');
        App.obj.questions[App.obj.question].type = type;
        App.obj.context = contextGeneral;
        App.obj.questions[App.obj.question].command = command;
        App.obj.questions[App.obj.question].context = context;
        App.obj.questions[App.obj.question].previous = Z.getInputCheckboxes('quiz-edit-check');
        for (let index = 0; index < 5; index++) {
            const optionText = Z.getValue(`#quiz-edit-option-${index}`);
            App.obj.questions[App.obj.question].options[index] = optionText;
        };
        App.storageSet();
        Z.modalHide();
        Slide.load();
    },

}

export default Slide;

