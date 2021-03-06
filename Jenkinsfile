pipeline {
    agent any
    options {
        buildDiscarder(logRotator(numToKeepStr: '50'))
    }
    triggers {
        cron('30 11 * * *')
    }
    stages {
        stage('Install npm') {
            when {
                branch 'master'
            }
            steps {
                sh 'npm install --unsafe-perm=true --allow-root'
            }
        }
        stage('Check eslint') {
            when {
                branch 'master'
            }
            steps {
                sh 'npm run check'
            }
        }
        stage('Run E2E Tests') {
            when {
                branch 'master'
            }
            steps {
                fetch_cypress_env()
                withCredentials([string(credentialsId: 'cypress_key', variable: 'CYPRESS_KEY')]) {
                    sh './node_modules/cypress/bin/cypress run --record --key $CYPRESS_KEY --group siglus-e2e'
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
