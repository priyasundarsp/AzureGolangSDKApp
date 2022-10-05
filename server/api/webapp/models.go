package webapp

type CreateWebAppRequest struct {
	Name string `json:"app_name" binding:"required"`
}
