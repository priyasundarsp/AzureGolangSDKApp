package configs

import (
	"fmt"
	"os"
	"strings"

	"github.com/aravinu19/golang-web-azure-app/logger"
)

var Config Configurations

const (
	ENV_AZURE_CLIENT_ID       = "AZURE_CLIENT_ID"
	ENV_AZURE_CLIENT_SECRET   = "AZURE_CLIENT_SECRET"
	ENV_AZURE_TENANT_ID       = "AZURE_TENANT_ID"
	ENV_AZURE_SUBSCRIPTION_ID = "AZURE_SUBSCRIPTION_ID"
	ENV_AZURE_RESOURCE_GROUP  = "AZURE_RESOURCE_GROUP_NAME"
	ENV_PORT                  = "PORT"
	ENV_ALLOWED_ADDR          = "ALLOWED_ADDR"
)

func getEnv(key string) (string, error) {
	if envs := os.Getenv(key); strings.Trim(envs, " ") == "" {
		logger.Logger.Printf("%s is not set\n", key)
		return "", fmt.Errorf("%s is not set", key)
	} else {
		return envs, nil
	}
}

func ReadConfigurations() error {
	var err error

	Config.AzureClientID, err = getEnv(ENV_AZURE_CLIENT_ID)
	if err != nil {
		return err
	}

	Config.AzureClientSecret, err = getEnv(ENV_AZURE_CLIENT_SECRET)
	if err != nil {
		return err
	}

	Config.AzureTenantID, err = getEnv(ENV_AZURE_TENANT_ID)
	if err != nil {
		return err
	}

	Config.AzureSubscriptionID, err = getEnv(ENV_AZURE_SUBSCRIPTION_ID)
	if err != nil {
		return err
	}

	Config.AzureResourceGroup, err = getEnv(ENV_AZURE_RESOURCE_GROUP)
	if err != nil {
		return err
	}

	Config.Port, _ = getEnv(ENV_PORT)
	if Config.Port == "" {
		logger.Logger.Println("Warning PORT not specified, falling back to default port 8080")
		Config.Port = "8080"
	}

	Config.AllowedAddr, _ = getEnv(ENV_ALLOWED_ADDR)
	if Config.AllowedAddr == "" {
		logger.Logger.Println("Warning ALLOWED_ADDR not specified, falling back to allowing Any IP 0.0.0.0")
		Config.AllowedAddr = "0.0.0.0"
	}

	return nil
}
