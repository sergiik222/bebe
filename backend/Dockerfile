# --- build stage ---
FROM golang:1.24 AS build
WORKDIR /app
COPY backend/go.mod backend/go.sum ./
ENV GOPROXY=https://proxy.golang.org,direct
RUN go mod download
COPY backend/ .
# build static linux binary
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o /bebe-api .

# --- run stage (small, secure image) ---
FROM gcr.io/distroless/base-debian12
ENV PORT=8080
EXPOSE 8080
USER nonroot:nonroot
COPY --from=build /bebe-api /bebe-api
ENTRYPOINT ["/bebe-api"]
