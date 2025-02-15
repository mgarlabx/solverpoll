import App from './script_app.js';
import Actions from './script_actions.js';

const Language = {

    set(lng) {
        this.loadAbout();
        App.obj.language = lng;
        App.storageSet();
        this.headerRefresh();
        Actions.infos();
    },

    getBrowserLanguage() {
        const browserLanguage = navigator.language || navigator.userLanguage;
        if (browserLanguage.startsWith('en-')) {
            return 'en';
        } else if (browserLanguage.startsWith('pt-')) {
            return 'pt';
        } else if (browserLanguage.startsWith('es-')) {
            return 'es';
        } else {
            return 'en';
        }
    },

    get(key) {
        if (key == "menu-about-txt") return Language.getAbout();
        const obj = this.dictionay.find(item => item.key === key);
        if (obj) {
            return obj[App.obj.language];
        } else {
            return `{{{${key}}}}`;
        }
    },

    headerRefresh() {
        // Header and menu
        document.getElementById('header-title').innerHTML = Language.get('header-title');
        document.getElementById('menu-caption-new').innerHTML = Language.get('menu-caption-new');
        document.getElementById('menu-caption-terms').innerHTML = Language.get('menu-caption-terms');
        document.getElementById('menu-caption-about').innerHTML = Language.get('menu-caption-about');
    },


    dictionay: [
        {
            "key": "header-title",
            "pt": "Solverpoll - Interatividade em sala de aula",
            "en": "Solverpoll - Classroom interactivity",
            "es": "Solverpoll - Interactividad en el aula",
        },
        {
            "key": "menu-caption-new",
            "pt": "Novo",
            "en": "New",
            "es": "Nuevo",
        },
        {
            "key": "menu-caption-about",
            "pt": "Sobre",
            "en": "About",
            "es": "Sobre",
        },
        {
            "key": "menu-caption-terms",
            "pt": "Termos",
            "en": "Terms",
            "es": "Términos",
        },

        
        {
            "key": "Sim",
            "pt": "Sim",
            "en": "Yes",
            "es": "Sí",
        },
        {
            "key": "Não",
            "pt": "Não",
            "en": "No",
            "es": "No",
        },
        {
            "key": "Idealizado e desenvolvido por Maurício Garcia",
            "pt": "Idealizado e desenvolvido por Maurício Garcia",
            "en": "Idealized and developed by Maurício Garcia",
            "es": "Idealizado y desarrollado por Maurício Garcia",
        },
        {
            "key": "Nova",
            "pt": "Nova",
            "en": "New",
            "es": "Nuevo",
        },
        {
            "key": "Abrir",
            "pt": "Abrir",
            "en": "Open",
            "es": "Abrir",
        },
        {
            "key": "Fechar",
            "pt": "Fechar",
            "en": "Close",
            "es": "Cerrar",
        },
        {
            "key": "Respostas",
            "pt": "Respostas",
            "en": "Responses",
            "es": "Respuestas",
        },
        {
            "key": "Resultados",
            "pt": "Resultados",
            "en": "Results",
            "es": "Resultados",
        },
        {
            "key": "Limpar",
            "pt": "Limpar",
            "en": "Clear",
            "es": "Limpiar",
        },
        {
            "key": "Reiniciar",
            "pt": "Reiniciar",
            "en": "Reset",
            "es": "Reiniciar",
        },
        {
            "key": "Tem certeza que deseja limpar as respostas?",
            "pt": "Tem certeza que deseja limpar as respostas?",
            "en": "Are you sure you want to clear the answers?",
            "es": "¿Estás seguro de que quieres borrar las respuestas?",
        },
        {
            "key": "Tem certeza que apagar tudo e reiniciar a sala?",
            "pt": "Tem certeza que apagar tudo e reiniciar a sala?",
            "en": "Are you sure you want to delete everything and restart the room?",
            "es": "¿Estás seguro de que quieres borrar todo y reiniciar la sala?",
        }, 
        {
            "key": "Editar",
            "pt": "Editar",
            "en": "Edit",
            "es": "Editar",
        },
        {
            "key": "Mostrar",
            "pt": "Mostrar",
            "en": "Show",
            "es": "Mostrar",
        }, 
        {
            "key": "Sala",
            "pt": "Sala",
            "en": "Room",
            "es": "Sala",
        },
        {
            "key": "Editar pergunta",
            "pt": "Editar pergunta",
            "en": "Edit question",
            "es": "Editar pregunta",
        }, 
        {
            "key": "Salvar",
            "pt": "Salvar",
            "en": "Save",
            "es": "Guardar",
        },
        {
            "key": "Arquivo inválido, dados não foram carregados",
            "pt": "Arquivo inválido, dados não foram carregados",
            "en": "Invalid file, data not loaded",
            "es": "Archivo inválido, datos no cargados",
        },
        {
            "key": "Informe o código da sala",
            "pt": "Informe o código da sala",
            "en": "Enter the room code",
            "es": "Ingrese el código de la sala",
        },
        {
            "key": "Instruções para insights por IA",
            "pt": "Instruções para insights por IA",
            "en": "Instructions for AI insights",
            "es": "Instrucciones para insights por IA",
        },
        {
            "key": "Contexto geral:",
            "pt": "Contexto geral:",
            "en": "General context:",
            "es": "Contexto general:",
        }, 
        {
            "key": "Contexto da questão:",
            "pt": "Contexto da questão:",
            "en": "Question context:",
            "es": "Contexto de la pregunta:",
        },
        {
            "key": "Questões anteriores a considerar:",
            "pt": "Questões anteriores a considerar:",
            "en": "Previous questions to consider:",
            "es": "Preguntas anteriores a considerar:",
        },
        {
            "key": "Para obter AI insights é necessário ter ao menos 10 respostas.",
            "pt": "Para obter AI insights é necessário ter ao menos 10 respostas.",
            "en": "To get AI insights you need at least 10 responses.",
            "es": "Para obtener AI insights es necesario tener al menos 10 respuestas.",
        },
        {
            "key": "Para obter AI insights é necessário informar o contexto geral e das perguntas.",
            "pt": "Para obter AI insights é necessário informar o contexto geral e das perguntas.",
            "en": "To get AI insights you need to inform the general context and questions.",
            "es": "Para obtener AI insights es necesario informar el contexto general y las preguntas.",
        },
        {
            "key": ""
        },
        {
            "key": ""
        },
        {
            "key": ""
        },
        {
            "key": ""
        },



    ],

   getAbout() {

        Language.menu_about_txt_pt = `
        O Solverpoll é uma ferramenta para interatividade em sala de aula, permitindo que o professor estimule a participação dos alunos por meio de perguntas exibidas na tela, acompanhadas de um QR Code. Esse código dá acesso à outra aplicação, permitindo que os alunos enviem suas respostas.<p><font color='red'><b>Importante</b>: as respostas ficam armazenadas por apenas 24 horas. Após esse prazo, são excluídas.</font><p>
        <h3>PREPARAÇÃO</h3>As perguntas devem ser elaboradas previamente e cadastradas na plataforma. Há três tipos de perguntas:<p><li> <b>Quiz</b>: os alunos respondem questões objetivas com até cinco alternativas (A, B, C, D e E). Após responderem, a ferramenta exibe um gráfico de barras horizontais com as respostas.</li><li> <b>Tag</b>: os usuários digitam uma palavra em seus dispositivos e, ao final, a ferramenta exibe uma nuvem de palavras, cujo tamanho de cada termo é proporcional à sua frequência.</li><li> <b>Post</b>: os usuários digitam pequenos textos em seus dispositivos e, ao final, a ferramenta lista os comentários enviados, possibilitando discussões com o professor.</li><p>Ao carregar a aplicação pela primeira vez, ela virá com perguntas previamente cadastradas, a título de exemplo. O usuário pode alterá-las clicando no ícone de lápis, localizado na parte superior esquerda da tela. Para mudar a pergunta, basta clicar na caixa de seleção ao lado do ícone.<p>
        <h3>USO DURANTE A AULA</h3>Quando uma pergunta é exibida, o QR Code aparece bloqueado por um cadeado. Ao clicar no cadeado, o acesso é liberado, e os alunos devem apontar a câmera de seus dispositivos para iniciar a interação. As respostas são contabilizadas por um contador localizado na parte superior direita da tela.<p>Quando todos terminarem de responder, o professor deve clicar no ícone com três barras verticais, localizado na parte superior direita da tela, para exibir as respostas. Caso deseje excluir todas as respostas, basta clicar no ícone de uma pequena lixeira.<p>
        <h3>INTELIGÊNCIA ARTIFICIAL</h3>O Solverpoll possui um recurso de IA que analisa as respostas dos alunos e gera insights e conclusões. Para isso, o usuário deve informar o contexto geral do conjunto de perguntas, bem como o contexto específico de cada uma. Essas informações são utilizadas para gerar o prompt da IA e podem ser cadastradas na mesma tela em que as perguntas são configuradas.<p>Para exibir os insights e conclusões gerados pela IA, basta clicar no ícone com pequenas estrelas, localizado na parte superior direita da tela.<p>
        `;

        Language.menu_about_txt_en = `
        Solverpoll is a tool for classroom interactivity, allowing teachers to encourage student participation through questions displayed on the screen, accompanied by a QR Code. This code gives access to another application, allowing students to send their answers.<p><font color='red'><b>Important</b>: answers are stored for only 24 hours. After this period, they are deleted.</font><p>
        <h3>PREPARATION</h3>Questions must be prepared in advance and registered on the platform. There are three types of questions:<p><li> <b>Quiz</b>: students answer objective questions with up to five alternatives (A, B, C, D and E). After responding, the tool displays a horizontal bar graph with the answers.</li><li> <b>Tag</b>: users type a word on their devices and, at the end, the tool displays a word cloud, where the size of each term is proportional to its frequency.</li><li> <b>Post</b>: users type short texts on their devices and, at the end, the tool lists the comments sent, enabling discussions with the teacher.</li><p>When loading the application for the first time, it will come with previously registered questions, as an example. The user can change them by clicking on the pencil icon, located in the upper left part of the screen. To change the question, simply click on the checkbox next to the icon.<p>
        <h3>USE DURING CLASS</h3>When a question is displayed, the QR Code appears blocked by a padlock. By clicking on the padlock, access is granted, and students must point the camera of their devices to start the interaction. The responses are counted by a counter located in the upper right part of the screen.<p>When everyone has finished responding, the teacher must click on the icon with three vertical bars, located in the upper right part of the screen, to display the responses. If you wish to delete all the responses, simply click on the icon with a small trash can.<p>
        <h3>ARTIFICIAL INTELLIGENCE</h3>Solverpoll has an AI feature that analyzes student responses and generates insights and conclusions. To do this, the user must inform the general context of the set of questions, as well as the specific context of each one. This information is used to generate the AI ​​prompt and can be registered on the same screen where the questions are configured.<p>To display the insights and conclusions generated by the AI, simply click on the icon with small stars, located in the upper right part of the screen.<p>        
        `;

        Language.menu_about_txt_es = `
        Solverpoll es una herramienta de interactividad en el aula, que permite al docente fomentar la participación de los alumnos a través de preguntas mostradas en la pantalla, acompañadas de un Código QR. Este código da acceso a otra aplicación, permitiendo a los estudiantes enviar sus respuestas.<p><font color='red'><b>Importante</b>: Las respuestas se almacenan solo durante 24 horas. Después de este plazo, se eliminan.</font><p>
        <h3>PREPARACIÓN</h3>Las preguntas deben prepararse con antelación y registrarse en la plataforma. Hay tres tipos de preguntas:<p><li><b>Quiz</b>: los estudiantes responden preguntas objetivas con hasta cinco alternativas (A, B, C, D y E). Después de responder, la herramienta muestra un gráfico de barras horizontales con las respuestas.</li><li> <b>Tag</b>: el usuario escribe una palabra en su dispositivo y, al final, la herramienta muestra una nube de palabras, donde el tamaño de cada término es proporcional a su frecuencia.</li><li> <b>Post</b>: el usuario escribe textos cortos en su dispositivo y, al final, la herramienta lista los comentarios enviados, posibilitando discusiones con el docente.</li><p>Al cargar la aplicación por primera vez, aparecerán preguntas previamente registradas, a modo de ejemplo. El usuario puede cambiarlos haciendo clic en el icono del lápiz, ubicado en la parte superior izquierda de la pantalla. Para cambiar la pregunta, simplemente haga clic en la casilla de verificación junto al ícono.<p>
        <h3>USO DURANTE LA CLASE</h3>Cuando se muestra una pregunta, el código QR aparece bloqueado por un candado. Al hacer clic en el candado, se concede el acceso y los estudiantes deben apuntar la cámara de sus dispositivos para iniciar la interacción. Las respuestas se contabilizan mediante un contador ubicado en la parte superior derecha de la pantalla.<p>Cuando todos hayan terminado de responder, el docente deberá hacer clic en el ícono con tres barras verticales, ubicado en la parte superior derecha de la pantalla, para mostrar las respuestas. Si desea eliminar todas las respuestas, simplemente haga clic en el pequeño ícono de la papelera.<p>
        <h3>INTELIGENCIA ARTIFICIAL</h3>Solverpoll tiene una función de IA que analiza las respuestas de los estudiantes y genera insights y conclusiones. Para ello, el usuario deberá informar el contexto general del conjunto de preguntas, así como el contexto específico de cada una de ellas. Esta información se utiliza para generar el prompt de la IA y se puede registrar en la misma pantalla donde se configuran las preguntas.<p>Para visualizar los insights y conclusiones generadas por la IA, simplemente haga clic en el ícono con pequeñas estrellas, ubicado en la parte superior derecha de la pantalla.<p>
        `;

        if (App.obj.language == 'pt') {
            return Language.menu_about_txt_pt;
        } else if (App.obj.language == 'es') {
            return Language.menu_about_txt_es;
        }
        return Language.menu_about_txt_en;

    }

};

export default Language;