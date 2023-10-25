.DEFAULT_GOAL := help

PHONY: build unit-test integration-test clean help

## This help screen
help:
	@printf "Available targets:\n\n"
	@awk '/^[a-zA-Z\-\_0-9%:\\]+/ { \
	helpMessage = match(lastLine, /^## (.*)/); \
	if (helpMessage) { \
	helpCommand = $$1; \
	helpMessage = substr(lastLine, RSTART + 3, RLENGTH); \
	gsub("\\\\", "", helpCommand); \
	gsub(":+$$", "", helpCommand); \
	printf "  \x1b[32;01m%-35s\x1b[0m %s\n", helpCommand, helpMessage; \
	} \
        } \
        { lastLine = $$0 }' $(MAKEFILE_LIST) | sort -u
	@printf "\n"

# starts a couchdb instance as a docker container
start-couchdb:
	docker run -d --name couchdb -p 5984:5984 -e COUCHDB_USER=$(REACT_APP_COUCHDB_USER) -e COUCHDB_PASSWORD=$(REACT_APP_COUCHDB_PASS) -v "${PWD}"/couchdb:/opt/couchdb/etc/local.d couchdb:latest
	@ sleep 3
	@ curl -X PUT http://$(REACT_APP_COUCHDB_USER):$(REACT_APP_COUCHDB_PASS)@127.0.0.1:5984/_users  > /dev/null 2>&1
	@ curl -X PUT http://$(REACT_APP_COUCHDB_USER):$(REACT_APP_COUCHDB_PASS)@localhost:5984/_replicator  > /dev/null 2>&1
	@ curl -X PUT http://$(REACT_APP_COUCHDB_USER):$(REACT_APP_COUCHDB_PASS)@localhost:5984/houseofmusic  > /dev/null 2>&1
	@ # Set permissions so that everyone can read
	@ curl -X PUT http://$(REACT_APP_COUCHDB_USER):$(REACT_APP_COUCHDB_PASS)@localhost:5984/houseofmusic/_security \
	-H "Content-Type: application/json" \
	-d '{"admins":{"names":[],"roles":[]},"members":{"names":[],"roles":[]}}' > /dev/null 2>&1

# stops and removes the couchdb instance
stop-couchdb:
	docker stop couchdb
	docker rm couchdb
	
include .env
export $(shell sed 's/=.*//' .env)
## Start ganache-cli in a docker container with prefunded address $(ACCOUNT) and 100 ETH
start-ganache:
	@ printf "\nStarting ganache-cli with prefunded account $(ACCOUNT)...\n\n"
	@ docker run -d --name ganache -p $(GANACHE_PORT):$(GANACHE_PORT) trufflesuite/ganache-cli --account="$(REACT_APP_PRIVATE_KEY),100000000000000000000" --account="$(SUBSCRIBER_PRIVATE_KEY),100000000000000000000" --port=$(GANACHE_PORT) || printf "\nFailed to start ganache-cli!\n\n"

## Stop ganache-cli
stop-ganache:
	@ printf "\nStopping ganache-cli...\n\n"
	@ docker rm -f ganache >/dev/null 2>&1 || printf "No ganache-cli container found.\n"

## Check ganahe-cli status
check-ganache:
	@ docker ps | grep ganache-cli >/dev/null 2>&1 || (echo "ganache-cli container is not running. Please run 'make start-ganache' first." && exit 1)
## Deploy contracts to ganache-cli
deploy:
	@ printf "\nDeploying contracts...\n\n"
	@ npx hardhat run --network ganache scripts/deployGanache.js

## Start Web3 dAPP
start-dapp:
	@ npm start