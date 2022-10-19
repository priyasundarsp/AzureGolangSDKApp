# AzureGolangSDKApp
Azure Sample app to show case basic resource creation capabilities with Golang SDK and Preact

# Tools
Visual studio code

# Prerequisties
Golang 18 or above version
NodeJS & NPM
Azure SDK (will be downloaded while running go mod tidy).

# Steps to run locally
## Clone the repo 
```
git clone https://github.com/priyasundarsp/AzureGolangSDKApp.git
```
## Run the Golang API App
Step-1:
```
cd server
```
Step-2:
set the values for the below environment variables,
1.AZURE_CLIENT_ID
2.AZURE_CLIENT_SECRET
3.AZURE_TENANT_ID
4.AZURE_SUBSCRIPTION_ID
5.AZURE_RESOURCE_GROUP_NAME
6.PORT
7.ALLOWED_ADDR

Step-3:
## start the golang api server
```
go run main.go
```
Step-4:
verify from browser => localhost:<port>/ping

## Run the Web UI
Step-1:
```
cd webui
```
Step-2:
```
npm i
```
Step-3:
```
npm run dev
```
Step-4:
verify from browser => localhost:<port>/

Now all set to make a API call to server from UI ,happy experimenting with golang :-)


# STEPS FOR AZURE DEVOPS CI PIPELINE CREATION:

## Prerequisties

1.Kubernetes cluster
2.Azure Container Registery

Step-1:
Go to your devops project -> create new CI -> Specify your fork repo for AzureGolangSDKApp 

Step-2:
use the https://github.com/priyasundarsp/AzureGolangSDKApp/blob/main/azure-pipelines.yml file to config CI using yaml config and run it 

Reference Kubernetes documents:
https://learn.microsoft.com/en-us/azure/aks/ingress-basic?tabs=azure-cli
https://learn.microsoft.com/en-us/azure/aks/http-application-routing

