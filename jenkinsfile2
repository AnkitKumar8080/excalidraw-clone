pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = 'ankit80/excalidraw-app'
        BUILD_NUMBER = "latest"
        DOCKER_CREDENTIALS = 'docker-hub-credentials'
        KUBE_CONFIG = 'mykubeconfig'  // Add this credential in Jenkins
    }
    
    stages {
        stage('Checkout') {
            steps {
                script {
                    try {
                        checkout scm
                    } catch (Exception e) {
                        error "Failed to checkout code: ${e.getMessage()}"
                    }
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    try {
                        // Using BUILD_NUMBER for versioning instead of just 'latest'
                        sh """
                            cd frontend
                            docker build -t ${DOCKER_IMAGE}:${BUILD_NUMBER} .
                            docker tag ${DOCKER_IMAGE}:${BUILD_NUMBER} ${DOCKER_IMAGE}:latest
                        """
                    } catch (Exception e) {
                        error "Docker build failed: ${e.getMessage()}"
                    }
                }
            }
        }
        
        stage('Push to Docker Hub') {
            steps {
                script {
                    try {
                        withDockerRegistry([credentialsId: DOCKER_CREDENTIALS, url: '']) {
                            sh """
                                docker push ${DOCKER_IMAGE}:${BUILD_NUMBER}
                                docker push ${DOCKER_IMAGE}:latest
                            """
                        }
                    } catch (Exception e) {
                        error "Failed to push Docker image: ${e.getMessage()}"
                    }
                }
            }
        }
        
        stage('Deploy to Kubernetes') {
            steps {
                script {
                    try {
                        // Using withKubeConfig for better credentials management
                        withKubeConfig([credentialsId: KUBE_CONFIG]) {
                            // Replace the image tag in the deployment file
                            sh "kubectl apply -f app-deployment.yaml -n jenkins"
                        }
                    } catch (Exception e) {
                        error "Kubernetes deployment failed: ${e.getMessage()}"
                    }
                }
            }
        }
    }
    
    post {
        success {
            echo "Pipeline executed successfully!"
        }
        failure {
            echo "Pipeline failed! Check the logs for details."
        }
    }
}