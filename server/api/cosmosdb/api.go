package cosmosdb

import (
	"fmt"
	"net/http"

	"github.com/Azure/azure-sdk-for-go/sdk/azcore/to"
	"github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/cosmos/armcosmos/v2"
	"github.com/aravinu19/golang-web-azure-app/client"
	"github.com/aravinu19/golang-web-azure-app/configs"
	"github.com/aravinu19/golang-web-azure-app/logger"
	"github.com/gin-gonic/gin"
)

var accountClient *armcosmos.DatabaseAccountsClient

func initAccountClient() {
	var err error

	accountClient, err = client.CosmosDBAccountsClient()
	if err != nil {
		logger.Logger.Fatalf("FATAL error while initializing the CosmosDB Client: %v", err)
	}
	logger.Logger.Println("cosmosdb client initialized")
}

func listAccounts(ctx *gin.Context) {
	pager := accountClient.NewListPager(nil)

	accounts := []gin.H{}

	for pager.More() {
		nextResult, err := pager.NextPage(ctx)
		if err != nil {
			logger.Logger.Printf("failed to advance page: %v", err)
			ctx.JSON(500, map[string]string{"error_message": "failed to retrieve cosmosdb accounts"})
			return
		}
		for _, account := range nextResult.Value {
			accounts = append(accounts, gin.H{
				"name":       *account.Name,
				"id":         *account.ID,
				"properties": *account.Properties,
			})
		}
	}

	ctx.JSON(200, gin.H{"accounts": accounts})
}

func createAccounts(ctx *gin.Context) {
	var request CreateAccountRequest

	if err := ctx.ShouldBindJSON(&request); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		logger.Logger.Printf("error while binding json to create account request: %v\n", err)
		return
	}

	poller, err := accountClient.BeginCreateOrUpdate(
		ctx,
		configs.Config.AzureResourceGroup,
		request.DatabaseAccountName,
		armcosmos.DatabaseAccountCreateUpdateParameters{
			Location: to.Ptr("westus"),
			Kind:     to.Ptr(armcosmos.DatabaseAccountKindGlobalDocumentDB),
			Properties: &armcosmos.DatabaseAccountCreateUpdateProperties{
				DatabaseAccountOfferType: to.Ptr("Standard"),
				Capabilities:             []*armcosmos.Capability{{Name: to.Ptr("EnableServerless")}},
				Locations: []*armcosmos.Location{{
					FailoverPriority: to.Ptr[int32](0),
					IsZoneRedundant:  to.Ptr(false),
					LocationName:     to.Ptr("westus"),
				}},
			},
		},
		nil,
	)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("error while creating database account: %v", err)})
		logger.Logger.Println(err.Error())
		return
	}

	_ = poller

	// resp, err := poller.Poll(ctx)
	// if err != nil {
	// 	ctx.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("error while poling for database account creation request status: %v", err)})
	// 	logger.Logger.Println(err.Error())
	// 	return
	// }

	ctx.JSON(http.StatusCreated, gin.H{"message": fmt.Sprintf("%s creation request is submitted, the account will be created", request.DatabaseAccountName)})
}

func deleteAccount(ctx *gin.Context) {
	accountName := ctx.Param("name")

	poller, err := accountClient.BeginDelete(
		ctx,
		configs.Config.AzureResourceGroup,
		accountName,
		nil,
	)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("error while deleting database account: %v", err)})
		logger.Logger.Println(err.Error())
		return
	}

	_ = poller

	ctx.JSON(http.StatusAccepted, gin.H{"message": fmt.Sprintf("%s deletion request is submitted, the account will be deleted", accountName)})
}

func LoadRoutes(rg *gin.RouterGroup) {
	initAccountClient()

	cdbGroup := rg.Group("/cosmosdb")

	cdbGroup.GET("accounts/", listAccounts)
	cdbGroup.PUT("accounts/", createAccounts)
	cdbGroup.DELETE("accounts/:name", deleteAccount)
}
