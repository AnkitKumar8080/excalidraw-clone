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
                sh 'docker buildx -t $DOCKER_IMAGE:latest .'
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
