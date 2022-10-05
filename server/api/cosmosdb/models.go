package cosmosdb

type CreateAccountRequest struct {
	DatabaseAccountName string `json:"database_account_name" binding:"required"`
}
