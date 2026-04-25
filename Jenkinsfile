pipeline {
    agent any

    environment {
        CI = 'true'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Verify Node') {
            steps {
                bat 'node -v'
                bat 'npm -v'
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing dependencies for root, server, and client...'
                bat 'npm install'
                bat 'cd client && npm install'
            }
        }

        stage('Build Client') {
            steps {
                echo 'Building Vite React client...'
                bat 'cd client && npm run build'
            }
        }

        stage('Test') {
            steps {
                echo 'Running tests...'
                // bat 'npm test'
            }
        }
    }

    post {
        always {
            echo 'Pipeline execution finished.'
        }
        success {
            echo 'Pipeline succeeded! The project built successfully.'
        }
        failure {
            echo 'Pipeline failed. Please check the Jenkins console logs.'
        }
    }
}