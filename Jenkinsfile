pipeline {
  agent any

  environment {
    COMPOSE_PROJECT = "sgu-jjrr-10a"
    PATH = "/usr/local/bin:${env.PATH}"
  }

  options {
    timestamps()
    ansiColor('xterm')
    buildDiscarder(logRotator(numToKeepStr: '20'))
    disableConcurrentBuilds()
  }

  stages {
    stage('Checkout SCM') {
      steps {
        checkout scm
        sh 'echo "Commit: $(git rev-parse --short HEAD)"'
      }
    }

    stage('Parando servicios...') {
      steps {
        sh '''
          # Detener y eliminar stack anterior (si existe)
          docker compose -p "$COMPOSE_PROJECT" down || true
        '''
      }
    }

    stage('Eliminando imagenes antiguas...') {
      steps {
        sh '''
          # Borrar imágenes con la etiqueta del proyecto de compose anterior
          IMAGES=$(docker images --filter "label=com.docker.compose.project=${COMPOSE_PROJECT}" -q)
          if [ -n "$IMAGES" ]; then
            docker rmi -f $IMAGES || true
          else
            echo "No hay imágenes por borrar"
          fi
        '''
      }
    }

    stage('Descargando actualización...') {
      steps {
        // Ya hicimos checkout arriba; deja la etapa para reflejar tu flujo
        sh 'echo "Código actualizado desde SCM"'
      }
    }

    stage('Construyendo y desplegando...') {
      steps {
        sh '''
          # Asegurar recursos externos declarados en el compose
          docker network create sgu-net 2>/dev/null || true
          docker volume create sgu-volume 2>/dev/null || true

          # Build + up con el nombre de proyecto para etiquetar contenedores
          docker compose -p "$COMPOSE_PROJECT" up --build -d

          echo "Servicios activos:"
          docker compose -p "$COMPOSE_PROJECT" ps
        '''
      }
    }
  }

  post {
    always {
      echo 'pipeline finalizada.'
    }
    success {
      echo 'La pipeline se ejecuto correctamente.'
    }
    failure {
      script {
        echo 'Ocurrió un error en la pipeline.'
        sh 'docker compose -p "$COMPOSE_PROJECT" logs --no-color || true'
      }
    }
  }
}
