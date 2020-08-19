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
            steps {
                sh 'npm install'
                sh 'npm install cypress --save-dev'
            }
        }
        stage('Run e2e tests') {
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
