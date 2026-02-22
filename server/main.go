package main

import (
	"embed"
	"flag"
	"fmt"
	"io/fs"
	"log"
	"net/http"
	"os"
	"strings"
)

//go:embed dist/*
var staticFiles embed.FS

func main() {
	port := flag.Int("port", 3000, "port to listen on")
	flag.Parse()

	if p := os.Getenv("PORT"); p != "" {
		fmt.Sscanf(p, "%d", port)
	}

	distFS, err := fs.Sub(staticFiles, "dist")
	if err != nil {
		log.Fatalf("failed to load embedded files: %v", err)
	}

	fileServer := http.FileServer(http.FS(distFS))

	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Set cache headers for assets
		if strings.HasPrefix(r.URL.Path, "/assets/") {
			w.Header().Set("Cache-Control", "public, max-age=31536000, immutable")
		}

		// Try to serve the file directly
		path := r.URL.Path
		if path == "/" {
			fileServer.ServeHTTP(w, r)
			return
		}

		// Check if the file exists in the embedded FS
		f, err := fs.Stat(distFS, strings.TrimPrefix(path, "/"))
		if err != nil || f.IsDir() {
			// SPA fallback: serve index.html for any unmatched route
			r.URL.Path = "/"
			fileServer.ServeHTTP(w, r)
			return
		}

		fileServer.ServeHTTP(w, r)
	})

	addr := fmt.Sprintf(":%d", *port)
	log.Printf("Tempest Display listening on http://0.0.0.0%s", addr)
	if err := http.ListenAndServe(addr, handler); err != nil {
		log.Fatalf("server error: %v", err)
	}
}
