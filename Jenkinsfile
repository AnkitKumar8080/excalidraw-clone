pipeline {
    agent any
    
    environment {
    DOCKER_IMAGE = 'ankit80/excalidraw-app'
    DOCKER_CREDENTIALS = 'docker-hub-credentials'
    GCP_CREDENTIALS = 'gcp-credentials'
    GCP_PROJECT_ID = "${env.GCP_PROJECT_ID}"
    GKE_CLUSTER_NAME = "${env.GKE_CLUSTER_NAME}"
    GKE_ZONE = "${env.GKE_ZONE}"
}
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    sh """
                        docker build -t ${DOCKER_IMAGE}:latest ./frontend
                    """
                }
            }
        }
        
        stage('Push to Docker Hub') {
            steps {
                withDockerRegistry([credentialsId: DOCKER_CREDENTIALS, url: '']) {
                    sh """
                        docker push ${DOCKER_IMAGE}:latest
                    """
                }
            }
        }

        stage('Deploy to GKE') {
            steps{
                step([
                $class: 'KubernetesEngineBuilder',
                projectId: ${GCP_PROJECT_ID},
                clusterName: ${GKE_CLUSTER_NAME},
                location: ${GKE_ZONE},
                manifestPattern: 'app-deployment.yaml',
                credentialsId: ${GCP_CREDENTIALS},
                verifyDeployments: true])
            }
        }
    }

    post {
      always {
        sh 'docker image prune -f'
      }
    }
}