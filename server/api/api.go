package api

import (
	"github.com/aravinu19/golang-web-azure-app/api/cosmosdb"
	"github.com/aravinu19/golang-web-azure-app/api/storage"
	"github.com/aravinu19/golang-web-azure-app/api/vnet"
	"github.com/aravinu19/golang-web-azure-app/api/webapp"
	"github.com/gin-gonic/gin"
)

func LoadServiceAPIs(router *gin.Engine) {
	apiV1 := router.Group("/api/v1")

	cosmosdb.LoadRoutes(apiV1)
	storage.LoadRoutes(apiV1)
	webapp.LoadRoutes(apiV1)
	vnet.LoadRoutes(apiV1)
}
