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
                        cd frontend
                        docker build -t ${DOCKER_IMAGE}:latest .
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


        stage('Configure GKE Access') {
            steps {
                script {
                    // Using the correct Google credentials binding
                    googleServiceAccount(credentialsId: GCP_CREDENTIALS) {
                        try {
                            sh """
                                gcloud container clusters get-credentials ${GKE_CLUSTER_NAME} \
                                    --zone ${GKE_ZONE} \
                                    --project ${GCP_PROJECT_ID}
                            """
                        } catch (Exception e) {
                            error "Failed to configure GKE access: ${e.getMessage()}"
                        }
                    }
                }
            }
        }

        stage('Deploy to GKE') {
            steps {
                script {
                    sh """
                        sed -i 's|${DOCKER_IMAGE}:[^ ]*|${DOCKER_IMAGE}:latest' app-deployment.yaml
                        kubectl apply -f app-deployment.yaml
                        kubectl rollout status deployment/excalidraw-app
                    """
                }
            }
        }
    }

    post {
      always {
        sh 'docker image prune -f'
      }
    }
}