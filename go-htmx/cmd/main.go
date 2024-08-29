package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/sessions"
)

var store = sessions.NewCookieStore([]byte(os.Getenv("AUTH0_SECRET")))

type Config struct {
	Auth0Domain       string
	Auth0ClientID     string
	Auth0ClientSecret string
	Auth0CallbackURL  string
}

func NewConfig() *Config {
	return &Config{
		Auth0Domain:       os.Getenv("AUTH0_DOMAIN"),
		Auth0ClientID:     os.Getenv("AUTH0_CLIENT_ID"),
		Auth0ClientSecret: os.Getenv("AUTH0_CLIENT_SECRET"),
		Auth0CallbackURL:  os.Getenv("AUTH0_CALLBACK_URL"),
	}
}

func init() {
	// Load environment variables from a .env file if present
	_ = godotenv.Load()
}

func main() {
	r := gin.Default()

	r.LoadHTMLGlob("templates/*")
	r.GET("/", func(c *gin.Context) {
		c.HTML(200, "index.tmpl", gin.H{})
	})
	r.GET("/about", func(c *gin.Context) {
		c.HTML(200, "about.tmpl", gin.H{
			"title": "About website",
		})
	})
	r.GET("/contact", func(c *gin.Context) {
		c.HTML(200, "contact.tmpl", gin.H{
			"title": "Contact website",
		})
	})
	r.POST("/contact", func(c *gin.Context) {
		c.HTML(200, "contact.tmpl", gin.H{
			"title": "Contact website",
		})
	})

	r.Static("/static", "./static")

	log.Fatal(r.Run(":8080"))
}
