FROM golang:alpine AS builder
WORKDIR /app
COPY . .
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o goservice main.go

FROM scratch
COPY --from=builder /app/goservice .
CMD [ "./goservice" ]
