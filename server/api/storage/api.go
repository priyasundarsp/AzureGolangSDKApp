package storage

import (
	"fmt"
	"net/http"

	"golang-web-azure-app/client"
	"golang-web-azure-app/configs"
	"golang-web-azure-app/logger"

	"github.com/Azure/azure-sdk-for-go/sdk/azcore/to"
	"github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/storage/armstorage"
	"github.com/gin-gonic/gin"
)

var accountClient *armstorage.AccountsClient

func initAccountClient() {
	var err error

	accountClient, err = client.StorageAccountsClient()
	if err != nil {
		logger.Logger.Fatalf("FATAL error while initializing the CosmosDB Client: %v", err)
	}
	logger.Logger.Println("cosmosdb client initialized")
}

func listAccounts(ctx *gin.Context) {
	pager := accountClient.NewListPager(nil)

	accounts := make([]*armstorage.Account, 0)

	for pager.More() {
		page, err := pager.NextPage(ctx)
		if err != nil {
			logger.Logger.Printf("failed to advance page: %v", err)
			ctx.JSON(500, map[string]string{"error_message": "failed to retrieve storage accounts"})
			return
		}

		accounts = append(accounts, page.Value...)
	}

	ctx.JSON(http.StatusOK, gin.H{"accounts": accounts})
}

func createAccounts(ctx *gin.Context) {
	var request CreateAccountRequest

	if err := ctx.ShouldBindJSON(&request); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		logger.Logger.Printf("error while binding json to create account request: %v\n", err)
		return
	}

	poller, err := accountClient.BeginCreate(
		ctx,
		configs.Config.AzureResourceGroup,
		request.StorageAccountName,
		armstorage.AccountCreateParameters{
			Kind: to.Ptr(armstorage.KindStorageV2),
			SKU: &armstorage.SKU{
				Name: to.Ptr(armstorage.SKUNameStandardLRS),
			},
			Location: to.Ptr("westus"),
			Properties: &armstorage.AccountPropertiesCreateParameters{
				AccessTier: to.Ptr(armstorage.AccessTierCool),
				Encryption: &armstorage.Encryption{
					Services: &armstorage.EncryptionServices{
						File: &armstorage.EncryptionService{
							KeyType: to.Ptr(armstorage.KeyTypeAccount),
							Enabled: to.Ptr(true),
						},
						Blob: &armstorage.EncryptionService{
							KeyType: to.Ptr(armstorage.KeyTypeAccount),
							Enabled: to.Ptr(true),
						},
						Queue: &armstorage.EncryptionService{
							KeyType: to.Ptr(armstorage.KeyTypeAccount),
							Enabled: to.Ptr(true),
						},
						Table: &armstorage.EncryptionService{
							KeyType: to.Ptr(armstorage.KeyTypeAccount),
							Enabled: to.Ptr(true),
						},
					},
					KeySource: to.Ptr(armstorage.KeySourceMicrosoftStorage),
				},
			},
		},
		nil,
	)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("error while creating storage account: %v", err)})
		logger.Logger.Println(err.Error())
		return
	}

	_ = poller

	ctx.JSON(http.StatusCreated, gin.H{"message": fmt.Sprintf("%s creation request is submitted, the account will be created", request.StorageAccountName)})
}

func deleteAccounts(ctx *gin.Context) {
	accountName := ctx.Param("name")

	poller, err := accountClient.Delete(
		ctx,
		configs.Config.AzureResourceGroup,
		accountName,
		nil,
	)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("error while deleting storage account: %v", err)})
		logger.Logger.Println(err.Error())
		return
	}

	_ = poller

	ctx.JSON(http.StatusAccepted, gin.H{"message": fmt.Sprintf("%s deletion request is submitted, the account will be deleted", accountName)})
}

func LoadRoutes(rg *gin.RouterGroup) {
	initAccountClient()

	storageGroup := rg.Group("/storage")

	storageGroup.GET("accounts/", listAccounts)
	storageGroup.PUT("accounts/", createAccounts)
	storageGroup.DELETE("accounts/:name", deleteAccounts)
}
