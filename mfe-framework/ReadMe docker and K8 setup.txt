1. Docker
- To build image and push to docker hub
refer - https://docs.docker.com/docker-hub/


- NOte- keep your docker hub repo as public

- To build docker image
docker build -t 42402112/sumit2112 .

- To run docker image in local
docker run -d -p 8080:80 42402112/sumit2112

/************************************************************/

2. Kubernetes

- install minikube

- To run minikube
minikube start

- To pull image and create service and deployment
kubectl apply -f my-angular-app.yaml

Note- In Yaml file give image same as in docker hub.

- To check kubernetes dashborad ( check deployment and services)
minikube dashboard

- To get created services
kubectl get services

- To run service in local
minikube service <service name>




