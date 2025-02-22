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
                sh 'npm install'
            }
        }
        stage('Run Tests') {
            steps {
                sh 'npm run ci'
            }
        }
    }
    post {
        success {
            mail body: "Project: ${env.JOB_NAME} <br>Build Number: ${env.BUILD_NUMBER} <br> Build URL: ${env.BUILD_URL}", charset: 'UTF-8', from: 'Jenkins', mimeType: 'text/html', subject: "Tests passed: Project name -> ${env.JOB_NAME}", to: "ilya.nechiporenko@gmail.com";
        }
        failure {
            mail body: "Project: ${env.JOB_NAME} <br>Build Number: ${env.BUILD_NUMBER} <br> Build URL: ${env.BUILD_URL}", charset: 'UTF-8', from: 'Jenkins', mimeType: 'text/html', subject: "Tests failed: Project name -> ${env.JOB_NAME}", to: "ilya.nechiporenko@gmail.com";
        }
    }
}
