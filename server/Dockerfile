FROM golang:alpine3.16 as build-stage

WORKDIR /go/src/golang-web-azure-app
ADD . ./
RUN GOOS=linux go build -o app_server

FROM alpine:3.16

WORKDIR /app
COPY --from=build-stage /go/src/golang-web-azure-app/app_server /app/
RUN chmod +x app_server

ENTRYPOINT [ "/app/app_server" ]
EXPOSE 8080

