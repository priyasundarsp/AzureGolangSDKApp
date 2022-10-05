package vnet

import (
	"fmt"
	"net/http"

	"github.com/Azure/azure-sdk-for-go/sdk/azcore/to"
	"github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/network/armnetwork"
	"github.com/aravinu19/golang-web-azure-app/client"
	"github.com/aravinu19/golang-web-azure-app/configs"
	"github.com/aravinu19/golang-web-azure-app/logger"
	"github.com/gin-gonic/gin"
)

var networkClient *armnetwork.VirtualNetworksClient

func initNetworkClient() {
	var err error

	networkClient, err = client.NetworkClient()
	if err != nil {
		logger.Logger.Fatalf("FATAL error while initializing the virtual networks Client: %v", err)
	}
	logger.Logger.Println("virtual networks client initialized")
}

func listNetworks(ctx *gin.Context) {
	pager := networkClient.NewListPager(configs.Config.AzureResourceGroup, nil)

	networks := make([]*armnetwork.VirtualNetwork, 0)

	for pager.More() {
		page, err := pager.NextPage(ctx)
		if err != nil {
			logger.Logger.Printf("failed to advance page: %v", err)
			ctx.JSON(500, map[string]string{"error_message": "failed to retrieve networks"})
			return
		}

		networks = append(networks, page.Value...)
	}

	ctx.JSON(http.StatusOK, gin.H{"networks": networks})
}

func createNetwork(ctx *gin.Context) {
	var request CreateVNetRequest

	if err := ctx.ShouldBindJSON(&request); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		logger.Logger.Printf("error while binding json to create network request: %v\n", err)
		return
	}

	poller, err := networkClient.BeginCreateOrUpdate(
		ctx,
		configs.Config.AzureResourceGroup,
		request.Name,
		armnetwork.VirtualNetwork{
			Location: to.Ptr(request.Region),
			Properties: &armnetwork.VirtualNetworkPropertiesFormat{
				AddressSpace: &armnetwork.AddressSpace{
					AddressPrefixes: []*string{
						to.Ptr(request.IPRange),
					},
				},
			},
		},
		nil,
	)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("error while creating vnet: %v", err)})
		logger.Logger.Println(err.Error())
		return
	}

	_ = poller

	ctx.JSON(http.StatusCreated, gin.H{"message": fmt.Sprintf("%s creation request is submitted, the vnet will be created", request.Name)})
}

func deleteNetwork(ctx *gin.Context) {
	networkName := ctx.Param("name")

	poller, err := networkClient.BeginDelete(
		ctx,
		configs.Config.AzureResourceGroup,
		networkName,
		nil,
	)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("error while deleting vnet: %v", err)})
		logger.Logger.Println(err.Error())
		return
	}

	_ = poller

	ctx.JSON(http.StatusAccepted, gin.H{"message": fmt.Sprintf("%s deletion request is submitted, the vnet will be deleted", networkName)})
}

func LoadRoutes(rg *gin.RouterGroup) {
	initNetworkClient()

	vnGroup := rg.Group("/vnet")

	vnGroup.GET("/", listNetworks)
	vnGroup.PUT("/", createNetwork)
	vnGroup.DELETE("/:name", deleteNetwork)
}
