REPO_NAME="ml_angular_userinterface"
OKD_TEMPLATE_REPO="OKD_templates"
OKD_TEMPLATE_BRANCH="feature/VAX2.1"
OKD_TEMPLATE_PATH="microservices"
OKD_PROJECT="mfe-framework"
OKD_APP="mfe-framework"
BRANCH="container/mfe_framework"
DOCKER_REGISTRY="docker-registry-default.router.default.svc.cluster.local/ml"
DOCKER_REG="docker-registry-default.router.default.svc.cluster.local/"
DOCKER_PUSH="docker-registry-default.router.default.svc.cluster.local/ml"
DOCKER_REG_TEMPLATE="docker-registry.default.svc:5000/ml"
GIT_PROJECT="rtx-swtl-git.fnc.net.local/scm/ml"
NFS_SERVER="167.254.204.123"
NFS_PATH="/mnt/k8sMount/ml"
REPO_NAME_FRONT_END="ngnix"

Help()
{
   # Display Help
   echo
   figlet "OKDPLOY  FNC"
   echo
   echo "okdploy 1.0.0 - fnc"
   echo "Utility to build and deploy okd apps from git sourcecode."
   echo
   echo "usage: okdploy [options] <sourcecode repo name>"
   echo
   echo "options:"
   echo "       -g  <git_project>             Git project name under which the source target repository is present."
   echo "       -b  <branch>                  Branch name of the target repository."
   echo "       -o  <okd_template_repo>       Name of the okd template repository. only needed if okd templates not in <source code repo name>."
   echo "       -v  <okd_template_branch>     Branch under which okd templates are present. only needed if okd templates not in <source code repo name>."
   echo "       -t  <okd_template_path>       path for the okd template yaml file."
   echo "       -n  <okd_project_name>        Project Name or Namespace to be created in OKD."
   echo "       -a  <okd_app_name>            App name for the deployment."
   echo "       -d  <dependency_repositories> Dependent git repositories with branch names example: '<repo1>:<branch1>;<repo2>:<branch2>...'"
   echo "       -r  <docker_registry>         Docker registry to pull the image for deployment."
   echo "       -w  <image_stream>            Docker registry image stream where the docker image needs to be pushed."
   echo "       -s  <nfs_server>              Server Name or IP of the NFS server for volume mount."
   echo "       -p  <nfs_path>                Absolute path for NFS mount."
   echo
   echo "Most common variables can be changed by editing the shell scrpit"
   echo
}

while [ "$1" != "" ]
do
    case $1 in
        -o|--okd_template_repo)
        OKD_TEMPLATE_REPO="$2"
        shift
        shift
        ;;
        -v|--okd_template_branch)
        OKD_TEMPLATE_branch="$2"
        shift
        shift
        ;;
        -t|--okd_template_path)
        OKD_TEMPLATE_PATH="$2"
        shift
        shift
        ;;
        -n|--okd_project_name)
        OKD_PROJECT="$2"
        shift
        shift
        ;;
        -a|--okd_app_name)
        OKD_APP="$2"
        shift
        shift
        ;;
        -d|--dependency_repositories)
        DEPENDENCY_REPO="$2"
        shift
        shift
        ;;
        -b|--branch)
        BRANCH="$2"
        shift
        shift
        ;;
        -r|--docker_registry)
        DOCKER_REGISTRY="$2"
        shift
        shift
        ;;
        -g|--git_project)
        GIT_PROJECT="$2"
        shift
        shift
        ;;
        -w|--image_stream)
        DOCKER_PUSH="$2"
        shift
        shift
        ;;
        -s|--nfs_server)
        NFS_SERVER="$2"
        shift
        shift
        ;;
        -p|--nfs_path)
        NFS_PATH="$2"
        shift
        shift
        ;;
        -h|--help)
        Help
        exit 1
        ;;
        *)
        REPO_NAME="$1"
        shift # Remove generic argument from processing
        ;;
    esac
done

if [ "$REPO_NAME" == "" ]
then
  Help;
  exit 1
fi

#mkdir temp_build_dir_12
#cd temp_build_dir_12

git clone -b $BRANCH http://automation:automation@$GIT_PROJECT/$REPO_NAME.git
cd $REPO_NAME
git pull
pwd
echo "installing npm"
sudo npm install 
echo "building npm"
sudo npm run build --prod --aot

#rm -Rf node_modules

COMMIT=$(git log --format="%H" -n 1)
echo "$COMMIT"

#cd ../

pwd

oc login https://telus-master.novalocal:8443  -u waruser -p waruser

sudo docker login -u openshift -p $(oc whoami -t) $DOCKER_REG
sleep 1m
#backendimage
#sudo docker build -f dockerfile_nginx -t $DOCKER_PUSH/$REPO_NAME:$COMMIT .
#oc login -u waruser -p waruser
#sudo docker login -u openshift -p $(oc whoami -t) $DOCKER_REG

#echo "$DOCKER_PUSH/$REPO_NAME:$COMMIT"

#sudo docker push $DOCKER_PUSH/$REPO_NAME:$COMMIT

#echo "docker backend image is pushed"

#front-end 
sudo docker build  -t $DOCKER_PUSH/$REPO_NAME:$COMMIT .
#oc login -u waruser -p waruser
#sudo docker login -u openshift -p $(oc whoami -t) $DOCKER_REG

#echo "$DOCKER_PUSH/$REPO_NAME_FRONT_END:$COMMIT"

sudo docker push $DOCKER_PUSH/$REPO_NAME:$COMMIT
echo "docker front end image is pushed "




OKD_NAME="mfe-framework"
oc delete project $OKD_NAME
oc new-project $OKD_NAME
oc project $OKD_NAME
#cd $REPO_NAME
oc new-app dep.yaml -p DOCKER_BACKEND_IMAGE_NAME=$DOCKER_REG_TEMPLATE/$REPO_NAME:$COMMIT -p NFS_SERVER=$NFS_SERVER

cd ../..
#sudo rm -R temp_build_dir_cont -f

echo $(oc whoami -t)
