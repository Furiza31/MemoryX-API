pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                sh 'chmod +x ./run-dev-tests-build.sh'
                sh './run-dev-tests-build.sh'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                    def scannerHome = tool 'SonarScanner'
                    withSonarQubeEnv('SonarQube') {
                        sh """
                            ${scannerHome}/bin/sonar-scanner \
                              -Dsonar.projectKey=MemoryX-API \
                              -Dsonar.projectName=MemoryX-API \
                              -Dsonar.sources=. \
                              -Dsonar.host.url=$SONAR_HOST_URL \
                              -Dsonar.token=$SONAR_AUTH_TOKEN
                        """
                    }
                }
            }
        }

	stage('Package artifact') {
            steps {
                sh '''
                    rm -f memoryx-api.tar.gz
                    tar -czf memoryx-api.tar.gz dist package.json package-lock.json README.adoc
                '''
            }
        }

        stage('Upload to Nexus') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'nexus-creds',
                    usernameVariable: 'NEXUS_USER',
                    passwordVariable: 'NEXUS_PASS'
                )]) {
                    sh '''
                        set +x
                        curl -f -u "$NEXUS_USER:$NEXUS_PASS" \
                          -X POST "http://localhost:8081/service/rest/v1/components?repository=raw-hosted" \
                          -F "raw.directory=memoryx-api" \
                          -F "raw.asset1=@memoryx-api.tar.gz" \
                          -F "raw.asset1.filename=memoryx-api.tar.gz"
                    '''
                }
            }
        }
    }
}
