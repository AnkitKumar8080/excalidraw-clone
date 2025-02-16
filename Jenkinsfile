pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = 'ankit80/excalidraw-app'
        BUILD_NUMBER = "${env.BUILD_NUMBER}"
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
                    try {
                        sh """
                            cd frontend
                            docker build -t ${DOCKER_IMAGE}:${BUILD_NUMBER} .
                            docker tag ${DOCKER_IMAGE}:${BUILD_NUMBER} ${DOCKER_IMAGE}:latest
                        """
                    } catch (Exception e) {
                        error "Failed to build Docker image: ${e.getMessage()}"
                    }
                }
            }
        }
        
        stage('Push to Docker Hub') {
            steps {
                withDockerRegistry([credentialsId: DOCKER_CREDENTIALS, url: '']) {
                    try {
                        sh """
                            docker push ${DOCKER_IMAGE}:${BUILD_NUMBER}
                            docker push ${DOCKER_IMAGE}:latest
                        """
                    } catch (Exception e) {
                        error "Failed to push Docker image: ${e.getMessage()}"
                    }
                }
            }
        }

        stage('Configure GKE Access') {
            steps {
                script {
                    // Changed credential binding to use file credentials
                    withCredentials([file(credentialsId: GCP_CREDENTIALS, variable: 'GOOGLE_APPLICATION_CREDENTIALS')]) {
                        try {
                            sh """
                                gcloud auth activate-service-account --key-file=\$GOOGLE_APPLICATION_CREDENTIALS
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
                    try {
                        sh """
                            sed -i 's|${DOCKER_IMAGE}:[^ ]*|${DOCKER_IMAGE}:${BUILD_NUMBER}|g' app-deployment.yaml
                            kubectl apply -f app-deployment.yaml
                            kubectl rollout status deployment/excalidraw-deployment --timeout=300s
                        """
                    } catch (Exception e) {
                        error "Failed to deploy to GKE: ${e.getMessage()}"
                    }
                }
            }
        }
    }

    post {
        always {
            sh 'docker image prune -f'
        }
        success {
            echo "Deployment completed successfully!"
        }
        failure {
            echo "Deployment failed! Check the logs for details."
        }
    }
}