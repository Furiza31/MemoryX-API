pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                sh 'chmod +x ./run-dev-tests-build.sh'
                sh './run-dev-tests-build.sh'
            }
        }
    }
}