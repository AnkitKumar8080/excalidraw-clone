pipeline {
    agent {
        kubernetes {
            yaml """
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: kubectl-container
    image: bitnami/kubectl
    command:
    - cat
    tty: true
"""
        }
    }
    environment {
        DOCKER_IMAGE = 'ankit80/excalidraw-app'
    }
    stages {
        stage('Checkout') {
            steps {
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
        stage('Deploy to Kubernetes') {
            steps {
                container('kubectl-container') {
                    sh 'kubectl apply -f deployment.yaml'
                }
            }
        }
    }
}
