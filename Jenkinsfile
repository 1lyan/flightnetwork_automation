pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'master', url: 'https://github.com/1lyan/flightnetwork_automation.git'
            }
        }
        stage('Build') {
            steps {
                npm install
            }
        }
        stage('Run Tests') {
            steps {
                npm run test
            }
        }
    }
}
