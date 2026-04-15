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
                nexusArtifactUploader(
                    nexusVersion: 'nexus3',
                    protocol: 'http',
                    nexusUrl: 'localhost:8081',
                    groupId: 'memoryx',
                    version: '1.0.0',
                    repository: 'raw-hosted',
                    credentialsId: 'nexus-creds',
                    artifacts: [
                        [
                            artifactId: 'memoryx-api',
                            classifier: '',
                            file: 'memoryx-api.tar.gz',
                            type: 'tar.gz'
                        ]
                    ]
                )
            }
        }
    }
}
