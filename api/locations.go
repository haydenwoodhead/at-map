package locations

import (
	"encoding/json"
	"log"
	"net/http"
	"os"

	"github.com/haydenwoodhead/at-map/aucklandtransport"
)

type LocationsResp struct {
	Vehicles []aucklandtransport.Vehicle
	Error    *string
}

// Handler is supposed to be run inside Vercel's serverless functions which is why it's a bit weird
func Handler(w http.ResponseWriter, r *http.Request) {
	key := os.Getenv("AT_API_KEY")
	if key == "" {
		log.Println("at api key not set")
		returnJSON(w, http.StatusInternalServerError, LocationsResp{Error: stringRef("at api key not set")})
		return
	}

	at := aucklandtransport.NewService(key)

	v, err := at.GetActiveVehicles()
	if err != nil {
		log.Printf("failed to get vehicle locations: %v\n", err)
		returnJSON(w, http.StatusInternalServerError, LocationsResp{Error: stringRef("failed to get vehicle locations")})
		return
	}

	returnJSON(w, http.StatusOK, LocationsResp{Vehicles: v})
}

func returnJSON(w http.ResponseWriter, status int, resp LocationsResp) {
	w.WriteHeader(status)
	err := json.NewEncoder(w).Encode(resp)
	if err != nil {
		log.Printf("returnJSON: failed to write response. err=%v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
}

func stringRef(s string) *string {
	return &s
}
