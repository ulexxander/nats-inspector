.PHONY: all

build:
	docker build -t nats-inspector .

up:
	docker run --name nats-inspector --rm -p 4001:80 nats-inspector

down:
	docker container stop nats-inspector && docker container rm nats-inspector

test-build:
	docker build -t goservice testenv/goservice
	docker build -t nodeservice testenv/nodeservice

test-up:
	docker-compose -f testenv/docker-compose.yml up
