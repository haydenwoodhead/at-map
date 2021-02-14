package aucklandtransport

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

const atBasePath = "https://api.at.govt.nz/v2"

type apiProvider struct {
	apiKey string
	client *http.Client
}

func newAPIProvider(apiKey string) *apiProvider {
	return &apiProvider{apiKey: apiKey, client: &http.Client{Timeout: time.Duration(6 * time.Second)}}
}

func (a *apiProvider) getGTFSVehicleLocations() ([]gtfsVehicleLocation, error) {
	req, err := http.NewRequest(http.MethodGet, fmt.Sprintf("%s/public/realtime/vehiclelocations", atBasePath), nil)
	if err != nil {
		return nil, fmt.Errorf("failed to generate req for gtfs vehicle locations: %w", err)
	}

	req.Header.Add("Ocp-Apim-Subscription-Key", a.apiKey)

	resp, err := a.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to get gtfs vehicle locations: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("gtfs vehicle location api returned error code: %v", resp.StatusCode)
	}

	var realtimeResponse gtfsVehicleLocationResponse
	err = json.NewDecoder(resp.Body).Decode(&realtimeResponse)
	if err != nil {
		return nil, fmt.Errorf("failed to deocode gtfs vehicle locations: %w", err)
	}

	return realtimeResponse.Response.Entity, nil
}

func (a *apiProvider) getGTFSRoutes() (map[string]gtfsRoute, error) {
	req, err := http.NewRequest(http.MethodGet, fmt.Sprintf("%s/gtfs/routes", atBasePath), nil)
	if err != nil {
		return nil, fmt.Errorf("failed to generate req for gtfs routes: %w", err)
	}

	req.Header.Add("Ocp-Apim-Subscription-Key", a.apiKey)

	resp, err := a.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to get gtfs routes: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("gtfs routes api returned error code: %v", resp.StatusCode)
	}

	var routesResp gtfsRouteResponse
	err = json.NewDecoder(resp.Body).Decode(&routesResp)
	if err != nil {
		return nil, fmt.Errorf("failed to decode gtfs routes: %w", err)
	}

	routes := map[string]gtfsRoute{}
	for _, route := range routesResp.Response {
		routes[route.RouteID] = route
	}

	return routes, nil
}