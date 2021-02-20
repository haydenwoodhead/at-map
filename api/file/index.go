package file

import (
	"log"
	"net/http"
	"os"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	_, err := os.Stat("/tmp/test.txt")
	if os.IsNotExist(err) {
		http.Error(w, "file not found - created", http.StatusOK)
		_, err := os.Create("/tmp/test.txt")
		if err != nil {
			log.Println(err)
			http.Error(w, "failed to create file", http.StatusInternalServerError)
			return
		}
		return
	}
	http.Error(w, "file found", http.StatusOK)
}
