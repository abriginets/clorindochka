#!/bin/bash

# Generate a random password
new_password=$(openssl rand -hex 16)

# Replace "CHANGE ME" with the generated password
sed -i "s/CHANGE ME/$new_password/g" ./docker/production/docker-compose.yml
