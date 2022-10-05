package main

import (
	"fmt"

	"github.com/aravinu19/golang-web-azure-app/api"
	"github.com/aravinu19/golang-web-azure-app/client"
	"github.com/aravinu19/golang-web-azure-app/configs"
	"github.com/aravinu19/golang-web-azure-app/logger"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func init() {
	logger.InitLogger()

	var err error

	err = configs.ReadConfigurations()
	if err != nil {
		logger.Logger.Fatalf("FATAL Error while reading configuration from environment variable: %v", err)
	}

	err = client.InitAzureCredentialClient()
	if err != nil {
		logger.Logger.Fatalf("%v", err)
	}

	logger.Logger.Println("Azure Credential Client Initialized")
}

func main() {
	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:8080"},
		AllowMethods:     []string{"PUT", "PATCH"},
		AllowHeaders:     []string{"Origin"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	router.GET("/ping", func(ctx *gin.Context) {
		ctx.JSON(200, gin.H{"message": "pong"})
	})

	api.LoadServiceAPIs(router)

	logger.Logger.Println("starting server ...")

	router.Run(fmt.Sprintf("%s:%s", configs.Config.AllowedAddr, configs.Config.Port))
}
