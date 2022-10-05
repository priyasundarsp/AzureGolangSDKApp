package vnet

type CreateVNetRequest struct {
	Name    string `json:"vnet_name" binding:"required"`
	IPRange string `json:"ip_range" binding:"required"`
	Region  string `json:"region" binding:"required"`
}
