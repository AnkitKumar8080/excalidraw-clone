pipeline {
    agent any
    environment {
        DOCKER_IMAGE = 'ankit80/excalidraw-app'
    }
    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/AnkitKumar8080/excalidraw-clone.git'
            }
        }
        stage('Build') {
            steps {
                sh 'docker build -t $DOCKER_IMAGE:latest .'
            }
        }
        stage('Push to Docker Hub') {
            steps {
                withDockerRegistry([credentialsId: 'docker-hub-credentials', url: '']) {
                    sh 'docker push $DOCKER_IMAGE:latest'
                }
            }
        }
        stage('Deploy to Kubernetes') {
            steps {
                sh 'kubectl apply -f deployment.yaml'
            }
        }
    }
}
