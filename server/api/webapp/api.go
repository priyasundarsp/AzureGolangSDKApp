package webapp

import (
	"fmt"
	"net/http"

	"github.com/Azure/azure-sdk-for-go/sdk/azcore/to"
	"github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/appservice/armappservice"
	"github.com/aravinu19/golang-web-azure-app/client"
	"github.com/aravinu19/golang-web-azure-app/configs"
	"github.com/aravinu19/golang-web-azure-app/logger"
	"github.com/gin-gonic/gin"
)

var staticwebappsClient *armappservice.StaticSitesClient

func initWebAppClient() {
	var err error

	staticwebappsClient, err = client.StaticWebAppsClient()
	if err != nil {
		logger.Logger.Fatalf("FATAL error while initializing the Web Apps Client: %v", err)
	}
	logger.Logger.Println("Web Apps client initialized")
}

func listWebApps(ctx *gin.Context) {
	pager := staticwebappsClient.NewListPager(nil)

	webapps := make([]*armappservice.StaticSiteARMResource, 0)

	for pager.More() {
		page, err := pager.NextPage(ctx)
		if err != nil {
			logger.Logger.Printf("failed to advance page: %v", err)
			ctx.JSON(500, map[string]string{"error_message": "failed to retrieve web apps"})
			return
		}

		webapps = append(webapps, page.Value...)
	}

	ctx.JSON(http.StatusOK, gin.H{"webapps": webapps})
}

func createWebApp(ctx *gin.Context) {
	var request CreateWebAppRequest

	if err := ctx.ShouldBindJSON(&request); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		logger.Logger.Printf("error while binding json to create web app request: %v\n", err)
		return
	}

	poller, err := staticwebappsClient.BeginCreateOrUpdateStaticSite(
		ctx,
		configs.Config.AzureResourceGroup,
		request.Name,
		armappservice.StaticSiteARMResource{
			Location: to.Ptr("eastus2"),
			SKU: &armappservice.SKUDescription{
				Name: to.Ptr("Free"),
			},
			Properties: &armappservice.StaticSite{},
		},
		nil,
	)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("error while creating static web app: %v", err)})
		logger.Logger.Println(err.Error())
		return
	}

	_ = poller

	ctx.JSON(http.StatusCreated, gin.H{"message": fmt.Sprintf("%s creation request is submitted, the static web app will be created", request.Name)})
}

func deletetWebApp(ctx *gin.Context) {
	siteName := ctx.Param("name")

	poller, err := staticwebappsClient.BeginDeleteStaticSite(
		ctx,
		configs.Config.AzureResourceGroup,
		siteName,
		nil,
	)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("error while deleting static web app: %v", err)})
		logger.Logger.Println(err.Error())
		return
	}

	_ = poller

	ctx.JSON(http.StatusAccepted, gin.H{"message": fmt.Sprintf("%s deletion request is submitted, the static web app will be deleted", siteName)})
}

func LoadRoutes(rg *gin.RouterGroup) {
	initWebAppClient()

	waGroup := rg.Group("/webapp")

	waGroup.GET("/", listWebApps)
	waGroup.PUT("/", createWebApp)
	waGroup.DELETE("/:name", deletetWebApp)
}
