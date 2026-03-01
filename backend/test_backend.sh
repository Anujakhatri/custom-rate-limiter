#!/bin/bash
alias=$(curl -s -X POST http://localhost:5001/api/shorten -H "Content-Type: application/json" -d '{"url":"https://wikipedia.org"}' | grep -o '"alias":"[^"]*' | cut -d'"' -f4)
echo "Created alias: $alias"

echo "--- Testing Redirection ---"
curl -I -s http://localhost:5001/$alias | grep Location

echo "--- Testing Analytics API ---"
curl -s http://localhost:5001/api/analytics/$alias
