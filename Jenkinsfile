pipeline {
  agent any

  environment {
    DOCKER_IMAGE_NAME = "excalidraw-clone"
    DOCKER_CONTAINER_NAME = "excalidraw"
  }

  stages {
    stage('checking the Source Control Manager') {
      steps{
        checkout scm
      }
    }

    stage('setting the version commit hash for image...'){
      steps {
        script{
          env.VERSION_COMMIT_HASH = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim() // versioning the build images
        }
      }
    }

    // build a docker image of the repository
    stage('building docker image...'){
      steps{
        sh "docker build -t ${DOCKER_IMAGE_NAME}:${VERSION_COMMIT_HASH} ./frontend"
      }
    }

    // remove the existing docker container if exists
    stage('checking for existing docker container'){
      steps{
        script{
          // search for existing docker container
          def existingContainer = sh(script: "docker ps -a -q -f name=${DOCKER_CONTAINER_NAME}", returnStdout: true).trim()

          if(existingContainer){
            echo "removing existing docker container"

            try{
              sh "docker stop ${DOCKER_CONTAINER_NAME}"
            }catch(Exception e){
              echo "Failed to stop existing container: ${e.getMessage()}"
            }
            
            sh "docker rm ${DOCKER_CONTAINER_NAME}"
          }else{
            echo "No existing docker container found"
          }
        }
      }
    }

    // spin up the docker container
    stage('running the docker container'){
      steps{
        sh "docker run -d --restart unless-stopped --name ${DOCKER_CONTAINER_NAME} -p 3000:3000 ${DOCKER_IMAGE_NAME}:${VERSION_COMMIT_HASH}"
      }
    }
  }

  // post {
  //   always {
  //     echo "Docker container status: $(docker inspect --format='{{.State.Status}}' ${DOCKER_CONTAINER_NAME})"
  //   }
  // }
}