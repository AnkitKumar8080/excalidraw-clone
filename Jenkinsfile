pipeline {
  agent any

  environment {
    DOCKER_IMAGE_NAME = "excalidraw-clone"
    DOCKER_CONTAINER_NAME = "excalidraw"
  }

  stages {
    stage('Checking the Source Control Manager') {
      steps {
        script {
          try {
            checkout scm
          } catch (Exception e) {
            currentBuild.result = 'FAILURE'
            throw e
          }
        }
      }
    }

    stage('Setting the Version Commit Hash for Image...') {
      steps {
        script {
          try {
            env.VERSION_COMMIT_HASH = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
          } catch (Exception e) {
            currentBuild.result = 'FAILURE'
            throw e
          }
        }
      }
    }

    stage('Building Docker Image...') {
      steps {
        script {
          try {
            sh "docker build --cache-from ${DOCKER_IMAGE_NAME}:latest -t ${DOCKER_IMAGE_NAME}:${VERSION_COMMIT_HASH} ./frontend"
          } catch (Exception e) {
            currentBuild.result = 'FAILURE'
            throw e
          }
        }
      }
    }

    stage('Checking for Existing Docker Container') {
      steps {
        script {
          try {
            // Search for existing Docker container
            def existingContainer = sh(script: "docker ps -a -q -f name=${DOCKER_CONTAINER_NAME}", returnStdout: true).trim()

            if (existingContainer) {
              echo "Removing existing Docker container"
              // Check if the container is running or stopped and remove it
              def containerStatus = sh(script: "docker inspect --format '{{.State.Status}}' ${DOCKER_CONTAINER_NAME}", returnStdout: true).trim()
              if (containerStatus == 'running') {
                sh "docker stop ${DOCKER_CONTAINER_NAME}"
              }
              sh "docker rm ${DOCKER_CONTAINER_NAME}"
            } else {
              echo "No existing Docker container found"
            }
          } catch (Exception e) {
            currentBuild.result = 'FAILURE'
            throw e
          }
        }
      }
    }

    stage('Running the Docker Container') {
      steps {
        script {
          try {
            sh "docker run -d --restart unless-stopped --name ${DOCKER_CONTAINER_NAME} -p 3000:3000 ${DOCKER_IMAGE_NAME}:${VERSION_COMMIT_HASH}"
          } catch (Exception e) {
            currentBuild.result = 'FAILURE'
            throw e
          }
        }
      }
    }
  }

  post {
    always {
      script {
        try {
          echo "Docker container status: ${(docker inspect --format='{{.State.Status}}' ${DOCKER_CONTAINER_NAME})}"
        } catch (Exception e) {
          echo "Failed to retrieve Docker container status"
        }
      }
    }

    success {
      echo "Pipeline completed successfully!"
    }

    failure {
      echo "Pipeline failed."
    }
  }
}
