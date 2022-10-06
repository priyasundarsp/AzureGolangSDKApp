package api

import (
	"golang-web-azure-app/api/cosmosdb"
	"golang-web-azure-app/api/storage"
	"golang-web-azure-app/api/vnet"
	"golang-web-azure-app/api/webapp"

	"github.com/gin-gonic/gin"
)

func LoadServiceAPIs(router *gin.Engine) {
	apiV1 := router.Group("/api/v1")

	cosmosdb.LoadRoutes(apiV1)
	storage.LoadRoutes(apiV1)
	webapp.LoadRoutes(apiV1)
	vnet.LoadRoutes(apiV1)
}
