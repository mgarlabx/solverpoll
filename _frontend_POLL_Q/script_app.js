import Language from "./script_language.js";
import Actions from "./script_actions.js";

const App = {

    apiPath: '',
    apiAIPath: 'https://v2mgud7dphuwn6yepv4fnyeqxa0ajmal.lambda-url.us-west-2.on.aws/', // please, change this to your own API.AI endpoint
    obj: {},

    responses: 0,

    load() {
        
        this.storageGet();

        const appName = 'solverpoll';
        Z.terms(appName, App.obj.language, res => {
            if (res === false) {
                Z.termsError(App.obj.language);
                return;
            }
        });
        Z.recordAccess(appName);

        // Set API path
        const currentPath = window.location.href;
        if (currentPath.includes('127.0')) {
            //this.apiPath = 'http://localhost:8889/solverpoll/_frontend_POLL_Q/q_app.php';
            this.apiPath = 'https://www.solvertank.tech/solverpoll/q_app.php';
        } else {
            this.apiPath = 'https://www.solvertank.tech/solverpoll/q_app.php';
        }

        

        // Exibe menu
        document.getElementById('menu-toggle').addEventListener('click', () => this.menuShow());

        // Clique nos itens do menu
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', event => {
                const action = event.target.closest('.menu-item').id;
                this.menuClick(action);
            });
        });

        // Oculta menu
        document.getElementById('header-left').addEventListener('click', () => this.menuHide());
        document.getElementById('slide').addEventListener('click', () => this.menuHide());
        document.getElementById('menu-dropdown').addEventListener('mouseleave', () => this.menuHide());

        Language.headerRefresh()
        Actions.load();



    },

    error(message) {
        Z.processing.hide();
        Z.hide('.all-div');
        Z.html('#error', message);
        Z.show('#error');
    },

    new() {
        localStorage.removeItem('solverpoll_q');
        this.storageGet();
        Language.headerRefresh()
        Actions.load();
    },


    storageGet() {

        const storage = localStorage.getItem('solverpoll_q');

        if (storage === null) {

            const randomChars = 'ABCDEFGHJKLMNPQRTUVWXYZabcdefghjklmnpqrtuvwxyz234678923467892346789';

            // Set user
            let randomString = '';
            for (let i = 0; i < 16; i++) {
                const randomIndex = Math.floor(Math.random() * randomChars.length);
                randomString += randomChars[randomIndex];
            }
            this.user = randomString;

            // Set room
            randomString = '';
            for (let i = 0; i < 5; i++) {
                const randomIndex = Math.floor(Math.random() * randomChars.length);
                randomString += randomChars[randomIndex];
            }
            this.room = randomString;

            this.obj = {
                user: this.user,
                room: this.room,
                status: 0,
                language: Language.getBrowserLanguage(),
                question: 0,
                responses: 0,
                "questions": [
                    {
                        "type": "quiz",
                        "command": "Which of these films did you like the most?",
                        "correct": 0,
                        "options": [
                            "2001: A Space Odyssey",
                            "The Terminator",
                            "Avatar",
                            "Alien",
                            "None of them"
                        ],
                        "context": "This is a simple question, but it seeks to analyze the audience's preference for science fiction films.",
                        "previous": []
                    },
                    {
                        "type": "quiz",
                        "command": "Have you seen the film Forrest Gump?",
                        "correct": 0,
                        "options": [
                            "Yes",
                            "No",
                            "I don't remember",
                            "",
                            ""
                        ],
                        "context": "This film is a classic, with the best ratings on platforms like IMDB. I want to know if this audience has already seen it. This is a great opportunity for those who haven't seen it.",
                        "previous": [
                            false
                        ]
                    },
                    {
                        "type": "tag",
                        "command": "Write one word that describes your feelings about the film Forrest Gump:",
                        "correct": 0,
                        "options": [
                            "",
                            "",
                            "",
                            "",
                            ""
                        ],
                        "context": "I'm curious to know what kind of feelings this film awakens in people.\n",
                        "previous": [
                            false,
                            true
                        ]
                    },
                    {
                        "type": "post",
                        "command": "Write a short text, with few words, with your analysis of the film Forrest Gump:",
                        "correct": 0,
                        "options": [
                            "",
                            "",
                            "",
                            "",
                            ""
                        ],
                        "context": "In the same line as the previous question, I would like to know more about what people thought of this film.\n",
                        "previous": [
                            false,
                            true,
                            true
                        ]
                    },
                    {
                        "type": "quiz",
                        "command": "(empty question)",
                        "correct": 0,
                        "options": [
                            "",
                            "",
                            "",
                            "",
                            ""
                        ],
                        "context": "",
                        "previous": [
                            false,
                            false,
                            false,
                            false
                        ]
                    }
                ],
                "context": "You are a film expert who is giving a presentation to an audience of adults, but with different profiles."
            }

            this.storageSet();

        } else {
            this.obj = JSON.parse(storage);
        }


    },

    // Armazena os dados no armazenamento local
    storageSet() {
        localStorage.setItem('solverpoll_q', JSON.stringify(this.obj));
    },

    menuShow() {
        document.getElementById('menu-dropdown').style.display = 'block';
    },

    menuHide() {
        document.getElementById('menu-dropdown').style.display = 'none';
    },

    menuClick(action) {
        this.menuHide();
        if (action === 'menu-new') {
            this.new();
        } else if (action === 'menu-en') {
            Language.set('en');
        } else if (action === 'menu-pt') {
            Language.set('pt');
        } else if (action === 'menu-es') {
            Language.set('es');
        } else if (action === 'menu-te') {
            Language.set('te');
        } else if (action === 'menu-download') {
            this.download();
        } else if (action === 'menu-upload') {
            this.upload();
        } else if (action === 'menu-edit') {
            this.edit();
        } else if (action === 'menu-clean') {
            this.clean();
        } else if (action === 'menu-feedback') {
            this.feedback();
        } else if (action === 'menu-terms') {
            this.terms();
        } else if (action === 'menu-info') {
            this.info();
        }
    },

    // Baixa o arquivo JSON 
    download() {
        const objDownload = App.obj;
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(objDownload));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "solverpoll.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    },

    // Faz o upload do arquivo JSON 
    upload() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = event => {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = event => {
                try {
                    const obj = JSON.parse(event.target.result);
                    if (obj.room && obj.user) {
                        App.obj = obj
                        App.storageSet();
                        App.load();
                    } else {
                        alert(Language.get('Arquivo inválido, dados não foram carregados') + '.');
                    }
                } catch (error) {
                    alert(Language.get('Arquivo inválido, dados não foram carregados') + '.');
                    console.error('Error:', error);
                }

            };
            reader.readAsText(file);
        };
        input.click();
    },

    terms() {
        Z.termsShow('solverpoll', App.obj.language, res => {
            if (res === false) {
                Z.termsError(App.obj.language);
                return;
            }
        });
    },

    info() {
        const title = Language.get('Idealizado e desenvolvido por Maurício Garcia');
        const text = Language.get('menu-about-txt');
        Z.modal(title, text);
    },

}

export default App

