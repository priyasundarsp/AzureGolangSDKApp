package client

import (
	"fmt"

	"github.com/Azure/azure-sdk-for-go/sdk/azidentity"
	"github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/appservice/armappservice"
	"github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/cosmos/armcosmos/v2"
	"github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/network/armnetwork"
	"github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/storage/armstorage"

	"golang-web-azure-app/configs"
	"golang-web-azure-app/logger"
)

var Creds *azidentity.ClientSecretCredential

func InitAzureCredentialClient() error {
	var err error
	Creds, err = azidentity.NewClientSecretCredential(
		configs.Config.AzureTenantID,
		configs.Config.AzureClientID,
		configs.Config.AzureClientSecret,
		nil,
	)
	if err != nil {
		return fmt.Errorf("error while initializing Azure Identity: %v", err)
	}

	return nil
}

func CosmosDBAccountsClient() (*armcosmos.DatabaseAccountsClient, error) {
	client, err := armcosmos.NewDatabaseAccountsClient(configs.Config.AzureSubscriptionID, Creds, nil)
	if err != nil {
		logger.Logger.Printf("Error: failed to creating CosmosDB Accounts Client - %v\n", err)
		return nil, err
	}

	return client, nil
}

func StorageAccountsClient() (*armstorage.AccountsClient, error) {
	client, err := armstorage.NewAccountsClient(configs.Config.AzureSubscriptionID, Creds, nil)
	if err != nil {
		logger.Logger.Printf("Error: failed to creating storage accounts client: %v\n", err)
		return nil, err
	}

	return client, nil
}

func StaticWebAppsClient() (*armappservice.StaticSitesClient, error) {
	client, err := armappservice.NewStaticSitesClient(configs.Config.AzureSubscriptionID, Creds, nil)
	if err != nil {
		logger.Logger.Printf("Error: failed to creating web apps client: %v\n", err)
		return nil, err
	}

	return client, nil
}

func NetworkClient() (*armnetwork.VirtualNetworksClient, error) {
	client, err := armnetwork.NewVirtualNetworksClient(configs.Config.AzureSubscriptionID, Creds, nil)
	if err != nil {
		logger.Logger.Printf("Error: failed to creating virtual networks client: %v\n", err)
		return nil, err
	}

	return client, nil
}
