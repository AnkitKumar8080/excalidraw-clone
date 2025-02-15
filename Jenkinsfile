pipeline {
    agent any
    environment {
        DOCKER_IMAGE = 'ankit80/excalidraw-app'
    }
    stages {
        stage('checking the Source Control Manager') {
          steps{
            checkout scm
          }
        } 
        stage('Build') {
            steps {
                sh 'docker build -t $DOCKER_IMAGE:latest ./frontend'
            }
        }
        stage('Push to Docker Hub') {
            steps {
                withDockerRegistry([credentialsId: 'docker-hub-credentials', url: '']) {
                    sh 'docker push $DOCKER_IMAGE:latest'
                }
            }
        }
        stage('install kubectl') {
          steps {
            sh '''
              curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
              chmod +x kubectl
              mv kubectl /usr/local/bin/kubectl
            '''
          }
        }
        stage('Deploy to Kubernetes') {
            steps {
                sh 'kubectl apply -f deployment.yaml'
            }
        }
    }
}
