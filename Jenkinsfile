pipeline {
    agent any

    environment {
        // Required for CI environments running React/Vite builds
        CI = 'true'
    }

    // Uncomment and configure the tools block if you are using the NodeJS Plugin in Jenkins
    // tools {
    //     nodejs 'NodeJS' // Make sure 'NodeJS' matches the name in Manage Jenkins -> Global Tool Configuration
    // }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing dependencies for root, server, and client...'
                // Note: If your Jenkins agent is running on Windows, change 'sh' to 'bat'
                sh 'npm run install-all'
            }
        }

        stage('Build Client') {
            steps {
                echo 'Building Vite React client...'
                // Note: If your Jenkins agent is running on Windows, change 'sh' to 'bat'
                sh 'npm run build --prefix client'
            }
        }
        
        // Optional: Run tests once you configure them in package.json
        stage('Test') {
            steps {
                echo 'Running tests...'
                // sh 'npm test'
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
