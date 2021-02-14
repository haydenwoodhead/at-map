package aucklandtransport

type atAPIProvider interface {
	getGTFSVehicleLocations() ([]gtfsVehicleLocation, error)
	getGTFSRoutes() (map[string]gtfsRoute, error)
}

type Service struct {
	api atAPIProvider
}

func NewService(apiKey string) *Service {
	return &Service{api: newAPIProvider(apiKey)}
}

type Vehicle struct {
	Name         string
	LicensePlate string
	Position     []float64
	Route        Route
	Type         int
}

type Route struct {
	Name string
	Code string
}

type gtfsVehicleLocationResponse struct {
	Response struct {
		Entity []gtfsVehicleLocation
	}
}

type gtfsVehicleLocation struct {
	IsDeleted bool `json:"is_deleted"`
	Vehicle   struct {
		Position struct {
			Latitude  float64
			Longitude float64
		}
		Vehicle struct {
			Label        string
			LicensePlate string `json:"license_plate"`
		}
		Trip struct {
			RouteID string `json:"route_id"`
		}
	}
}

type gtfsRouteResponse struct {
	Response []gtfsRoute
}

type gtfsRoute struct {
	RouteID        string `json:"route_id"`
	RouteShortName string `json:"route_short_name"`
	RouteLongName  string `json:"route_long_name"`
	RouteType      int    `json:"route_type"`
}

func (s *Service) GetActiveVehicles() ([]Vehicle, error) {
	vehicleLocations, err := s.api.getGTFSVehicleLocations()
	if err != nil {
		return nil, err
	}

	routes, err := s.api.getGTFSRoutes()
	if err != nil {
		return nil, err
	}

	return s.transformProviderResp(vehicleLocations, routes), nil
}

func (s *Service) transformProviderResp(vehicleLocations []gtfsVehicleLocation, routes map[string]gtfsRoute) []Vehicle {
	vehicles := make([]Vehicle, 0, len(vehicleLocations))

	for _, vl := range vehicleLocations {
		if vl.IsDeleted {
			continue
		}

		gtfsRoute := routes[vl.Vehicle.Trip.RouteID]

		v := Vehicle{
			Name:         vl.Vehicle.Vehicle.Label,
			LicensePlate: vl.Vehicle.Vehicle.LicensePlate,
			Type:         gtfsRoute.RouteType,
			Position:     []float64{vl.Vehicle.Position.Latitude, vl.Vehicle.Position.Longitude},
			Route: Route{
				Name: gtfsRoute.RouteLongName,
				Code: gtfsRoute.RouteShortName,
			},
		}

		vehicles = append(vehicles, v)
	}

	return vehicles
}
