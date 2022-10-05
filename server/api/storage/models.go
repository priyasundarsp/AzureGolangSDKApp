package storage

type CreateAccountRequest struct {
	StorageAccountName string `json:"storage_account_name" binding:"required"`
}
