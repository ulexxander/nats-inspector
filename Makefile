.PHONY: all

inspector-build:
	docker build -t nats-inspector .

inspector-up:
	docker-compose up --remove-orphans
