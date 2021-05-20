.PHONY: all

image-build:
	docker build -t nats-inspector .

image-run:
	docker run --rm -p 4001:80 nats-inspector

test-build:
	docker build -t goservice test/goservice
	docker build -t nodeservice test/nodeservice

test-up:
	docker-compose -f test/docker-compose.yml up
