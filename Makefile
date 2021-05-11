.PHONY: all

inspector-build:
	docker build -t nats-inspector .

inspector-up:
	docker-compose up --remove-orphans

test-build:
	docker build -t goservice test/goservice
	docker build -t nodeservice test/nodeservice

test-up:
	docker-compose -f test/docker-compose.yml up
