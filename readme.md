# SolverPoll

Solverpoll is a tool for classroom interactivity, allowing teachers to encourage student participation through questions displayed on the screen, accompanied by a QR Code. This code gives access to another application, allowing students to send their answers. Solverpoll has an AI feature that analyzes student responses and generates insights and conclusions.

The system is made up of three applications:

### _frontend_POLL_Q

This is the main application, the one that the teacher displays in the classroom, on the projector, sharing his/her computer screen. It was designed for desktop screens, so it should not be used on smaller devices, such as tablets and cell phones. It was written in HTML/CSS/JS, but to record and display the responses, there is a small script in PhP that accesses a MySQL database.

### _frontend_POLL_R

This is the application that students use when they position the camera of their devices towards the displayed QRCode. It was also written in HTML/CSS/JS and, similarly, to record and display the responses, there is a small script in PhP that accesses a MySQL database.

### _backend_POLL_AI

This is the application that uses artificial intelligence to generate insights and conclusions. It was written in Python and runs on an AWS lambda function, using the platform's free tier.
