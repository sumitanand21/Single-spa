echo "docker reg names"
dockerreg1="docker-registry.default.svc:5000"
dockerreg2="default-route-openshift-image-registry.apps.lab.okd.local"
namespace1="ml"
namespace2="vax-images"

JSON_Content='[{"microservicename1":"modelandexecutions_ms",
                "tag1":"883e965004810fc47ee6b4950aae98a7bdaa74e3",
                "microservicename2":"modelandexecutions_ms",
                "tag2":"v1.2"}]'

for row in $(echo "${JSON_Content}" | jq -r '.[] | @base64'); do
    _jq() {
     echo ${row} | base64 --decode | jq -r ${1}
    }
   echo $(_jq '.microservicename1')
   echo $(_jq '.tag1')
   echo $(_jq '.microservicename2')
   echo $(_jq '.tag2')

   sudo docker pull $dockerreg1/$namespace1/$(_jq '.microservicename1'):$(_jq '.tag1')

   echo " pulled -->> $dockerreg1/$namespace1/$(_jq '.microservicename1'):$(_jq '.tag1')"

   sudo docker tag $dockerreg1/$namespace1/$(_jq '.microservicename1'):$(_jq '.tag1') $dockerreg2/$namespace2/$(_jq '.microservicename2'):$(_jq '.tag2')

   echo " tagged -->> $dockerreg1/$namespace1/$(_jq '.microservicename1'):$(_jq '.tag1') $dockerreg2/$namespace2/$(_jq '.microservicename2')-$(_jq '.tag2')"

   sudo docker save -o /home/centos/praveen/vax-images/$(_jq '.microservicename2')-$(_jq '.tag2').tar $dockerreg2/$namespace2/$(_jq '.microservicename2'):$(_jq '.tag2')

   echo "saved -->> $dockerreg2/$namespace2/$(_jq '.microservicename2'):$(_jq '.tag2').tar $(_jq '.microservicename2')-$(_jq '.tag2').tar"

done


