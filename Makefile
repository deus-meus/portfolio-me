.PHONY: dev dev-api dev-web test build-web build seed clean

dev-api:
	go run cmd/server/main.go

dev-web:
	cd web && npm run dev

dev:
	make -j2 dev-api dev-web

test:
	go test -v -race ./...

build-web:
	cd web && npm run build

build: build-web
	go build -ldflags="-s -w" -o bin/portfolio cmd/server/main.go

seed:
	go run cmd/seed/main.go

clean:
	rm -rf bin/ web/dist/ portfolio.db*
