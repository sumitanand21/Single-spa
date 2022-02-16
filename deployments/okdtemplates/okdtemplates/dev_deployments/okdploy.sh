REPO_NAME=""
DEPENDENCY_REPO="ml_framework:bug/am2_inheritance_fix"
OKD_TEMPLATE_REPO="OKD_templates"
OKD_TEMPLATE_BRANCH="PR-R1.0_templates"
OKD_TEMPLATE_PATH="microservices"
OKD_PROJECT="tes"
OKD_APP="anomalymodel2_execution"
BRANCH="master"
DOCKER_REGISTRY="docker-registry.default.svc:5000/ml"
DOCKER_REG="docker-registry-default.router.default.svc.cluster.local"
DOCKER_PUSH="docker-registry-default.router.default.svc.cluster.local/ml"
GIT_PROJECT="rtx-swtl-git.fnc.net.local/scm/ml"
NFS_SERVER="167.254.204.64"
NFS_PATH="/mnt/k8sMount/ml"

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

mkdir temp_build_dir
cd temp_build_dir

git clone -b $BRANCH http://automation:automation@$GIT_PROJECT/$REPO_NAME.git
cd $REPO_NAME
COMMIT=$(git log --format="%H" -n 1)
echo "$COMMIT"

IFS=';' read -ra ADDR <<< "$DEPENDENCY_REPO"
for i in "${ADDR[@]}"; do
    D_REPO="$(echo $i | cut -d ':' -f 1)"
    D_BRANCH="$(echo $i | cut -d ':' -f 2)"
    git clone -b $D_BRANCH http://automation:automation@$GIT_PROJECT/$D_REPO.git
done

sudo docker build -t $DOCKER_PUSH/$REPO_NAME:$COMMIT .
oc login -u waruser -p waruser
sudo docker login -u openshift -p $(oc whoami -t) $DOCKER_PUSH

echo "$DOCKER_PUSH/$REPO_NAME:$COMMIT"

sudo docker push $DOCKER_PUSH/$REPO_NAME:$COMMIT

if [ "$OKD_TEMPLATE_REPO" != "" ]
then
  cd ..
  git clone -b $OKD_TEMPLATE_BRANCH http://automation:automation@$GIT_PROJECT/$OKD_TEMPLATE_REPO.git
  cd $OKD_TEMPLATE_REPO
fi

OKD_NAME=$OKD_PROJECT

oc new-project $OKD_NAME
oc project $OKD_NAME
oc adm policy add-scc-to-user anyuid -z default -n $OKD_NAME
oc policy add-role-to-user system:image-puller system:serviceaccount:$OKD_NAME:default --namespace=ml
oc delete svc ${OKD_APP//_/-} -n $OKD_NAME
oc delete configmap ${OKD_APP//_/-}-config -n $OKD_NAME
oc delete deployment ${OKD_APP//_/-} -n $OKD_NAME

oc new-app $OKD_TEMPLATE_PATH/$OKD_APP.yaml -p DOCKER_REGISTRY=$DOCKER_REGISTRY -p DOCKER_IMAGE_NAME=$REPO_NAME -p DOCKER_IMAGE_TAG=$COMMIT -p NFS_SERVER=$NFS_SERVER -p NFS_PATH=$NFS_PATH

cd ../..
sudo rm -R temp_build_dir -f

echo $(oc whoami -t)
