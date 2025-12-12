pipeline {
  agent any
  environment {
        PATH = "/usr/local/bin:${env.PATH}"
    }

  stages {
    stage('Checkout SCM') {
      steps {
        checkout scm
      }
    }

    stage('Parando servicios') {
      steps {
        sh 'docker compose down || true'
      }
    }

    stage('Eliminadno imagenes antiguas...') {
        steps {
            sh '''
                IMAGES=$(docker images --filter "label=com.docker.compose.project=demo" -q)
                if [ -n "$IMAGES" ]; then
                   docker rmi -f $IMAGES
                else
                   echo "No hay images por borrar"
                fi
            '''
        }
    }

    stage('Descargando actualizacion...') {
        steps {
            checkout scm 
        }
    }

    stage('Construyendo y desplegando') {
      steps {
        // Damos permisos de ejecución y corremos el script de setup
        // Este script se encarga de crear redes, volúmenes y certificados SSL
        sh 'chmod +x setup_docker.sh'
        sh './setup_docker.sh'
      }
    }
  }

  post {
    always { echo 'Pipeline finalizada.' }
    success { echo 'OK.' }
    failure { echo 'Falló.' }
  }
}
