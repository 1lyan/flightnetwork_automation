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
        stage('Parallel') {
            steps {
                parallel(
                    tests: {
                        sh 'npm run ci'
                    },
                    lint: {
                        sh 'npm run lint'
                    }
                )
            }
        }
    }
    post {
        success {
            emailext(
                subject: "Tests Passed: ${currentBuild.currentResult}: ${env.JOB_NAME} ${env.BUILD_NUMBER}",
                to: "ilya.nechiporenko@gmail.com",
                body: "${env.BUILD_URL}"
            )
        }
        failure {
            emailext(
                subject: "Tests Failed: ${currentBuild.currentResult}: ${env.JOB_NAME} ${env.BUILD_NUMBER}",
                to: "ilya.nechiporenko@gmail.com",
                body: "${env.BUILD_URL}"
            )
        }
    }
}
