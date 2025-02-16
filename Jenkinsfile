pipeline {
    agent any
    
    environment {
    DOCKER_IMAGE = 'ankit80/excalidraw-app'
    BUILD_NUMBER = "latest"
    DOCKER_CREDENTIALS = credentials('docker-hub-credentials')
    GCP_CREDENTIALS = credentials('gcp-credentials')
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
                        docker build -t ${DOCKER_IMAGE}:${BUILD_NUMBER} .
                        docker tag ${DOCKER_IMAGE}:${BUILD_NUMBER} ${DOCKER_IMAGE}:latest
                    """
                }
            }
        }
        
        stage('Push to Docker Hub') {
            steps {
                withDockerRegistry([credentialsId: DOCKER_CREDENTIALS, url: '']) {
                    sh """
                        docker push ${DOCKER_IMAGE}:${BUILD_NUMBER}
                        docker push ${DOCKER_IMAGE}:latest
                    """
                }
            }
        }


        stage('Configure GKE Access') {
            steps {
                script {
                    // Using Google Service Account credentials
                    withCredentials([[$class: 'GoogleServiceAccountCredential',
                                    credentialsId: GCP_CREDENTIALS,
                                    keyFileVariable: 'GOOGLE_APPLICATION_CREDENTIALS']]) {
                        sh """
                            gcloud auth activate-service-account --key-file=\$GOOGLE_APPLICATION_CREDENTIALS
                            gcloud container clusters get-credentials ${GKE_CLUSTER_NAME} \
                                --zone ${GKE_ZONE} \
                                --project ${GCP_PROJECT_ID}
                        """
                    }
                }
            }
        }

        stage('Deploy to GKE') {
            steps {
                script {
                    sh """
                        sed -i 's|${DOCKER_IMAGE}:[^ ]*|${DOCKER_IMAGE}:${BUILD_NUMBER}|g' app-deployment.yaml
                        kubectl apply -f app-deployment.yaml
                        kubectl rollout status deployment/excalidraw-deployment
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