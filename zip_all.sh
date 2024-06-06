#!/bin/bash

# List of specific directories to include in the zip
directories_to_zip=(
    "AccountService"
    "AdminApp"
    "APIKeyService"
    "OrderService"
    "ProductService"
    "ShopperApp"
    "VendorAPI"
    "VendorApp"
    "sql"
)

# Name of the final zip file
final_zip_file="final.zip"

# Include docker-compose.yml and package.json
items_to_zip=("${directories_to_zip[@]}" "docker-compose.yml" "package.json")

# Create a single zip file containing all specified directories and files, explicitly excluding unwanted files
zip -rv "${final_zip_file}" "${items_to_zip[@]}" \
    -x '**/node_modules/*' \
    -x '**/.next/*' \
    -x '**/build/*' \
    -x '**/coverage/*' \
    -x '**/.swc/*' \
    -x '*.DS_Store/*' \
    -x '.DS_Store' \
    -x '*/.DS_Store'

echo "Created ${final_zip_file} containing all specified directories and files"

