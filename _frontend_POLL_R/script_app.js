
const App = {

    apiPath: '',
    user: '',

    load() {

        // Set API path
        const currentPath = window.location.href;
        if (currentPath.includes('127.0')) {
            //this.apiPath = 'http://localhost:8889/solverpoll/r/r_app.php';
            this.apiPath = 'https://www.solvertank.tech/solverpoll/r/r_app.php';
        } else {
            this.apiPath = 'https://www.solvertank.tech/solverpoll/r/r_app.php';
        }

        // Set user
        const storage = localStorage.getItem('solverpoll_r');
        if (storage === null) {
            const randomChars = 'ABCDEFGHJKLMNPQRTUVWXYZabcdefghjklmnpqrtuvwxyz234678923467892346789';
            let randomString = '';
            for (let i = 0; i < 16; i++) {
                const randomIndex = Math.floor(Math.random() * randomChars.length);
                randomString += randomChars[randomIndex];
            }
            localStorage.setItem('solverpoll_r', JSON.stringify({ user: randomString }));
            this.user = randomString;
        } else {
            this.user = JSON.parse(storage).user;
        }

    },

    error(message) {
        Z.processing.hide();
        Z.hide('.all-div');
        Z.html('#error', message);
        Z.show('#error');
    }

}

export default App

