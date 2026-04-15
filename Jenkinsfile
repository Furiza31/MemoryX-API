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
            when {
                anyOf {
                    branch 'main'
                    branch 'dev'
                }
            }
            steps {
                script {
                    def scannerHome = tool 'SonarScanner'
                    withSonarQubeEnv('SonarQube') {
                        sh """
                            ${scannerHome}/bin/sonar-scanner \
                              -Dsonar.projectKey=MemoryX-API \
                              -Dsonar.projectName=MemoryX-API \
                              -Dsonar.sources=. \
                              -Dsonar.token=$SONAR_AUTH_TOKEN
                        """
                    }
                }
            }
        }

        stage('Package artifact') {
            when {
                branch 'main'
            }
            steps {
                sh '''
                    rm -f memoryx-api.tar.gz
                    tar -czf memoryx-api.tar.gz dist package.json package-lock.json README.adoc
                '''
            }
        }

        stage('Upload to Nexus') {
            when {
                branch 'main'
            }
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

        stage('Feature branch info') {
            when {
                expression {
                    env.BRANCH_NAME.startsWith('feature/')
                }
            }
            steps {
                echo "Pipeline léger exécuté pour ${env.BRANCH_NAME}"
            }
        }
    }
}
