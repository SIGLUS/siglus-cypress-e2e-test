pipeline {
    agent any
    options {
        buildDiscarder(logRotator(numToKeepStr: '50'))
    }
    stages {
        stage('Install npm') {
            when {
                branch 'master'
            }
            steps {'
                sh 'npm install --unsafe-perm=true --allow-root'

            }
        }
        stage('Run E2E Tests') {
            when {
                branch 'master'
            }
            steps {
                fetch_cypress_env()
                withCredentials([string(credentialsId: 'cypress_key', variable: 'CYPRESS_KEY')]) {
                    sh './node_modules/cypress/bin/cypress run --record --key $CYPRESS_KEY'
                }
            }
        }
        stage('Clear Artifacts') {
            when {
                branch 'master'
            }
            steps {
                sh 'rm -rf cypress/screenshots cypress/videos'
            }
        }
    }
}

def fetch_cypress_env() {
    withCredentials([file(credentialsId: 'cypress_env', variable: 'CYPRESS_ENV')]) {
        sh '''
            rm -f cypress.env.json
            cp $CYPRESS_ENV cypress.env.json
        '''
    }
}
