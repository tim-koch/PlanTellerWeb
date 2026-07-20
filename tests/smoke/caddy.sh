#!/usr/bin/env sh
set -eu

base_url="${1:-http://127.0.0.1:8081}"

assert_status() {
  expected="$1"
  path="$2"
  actual="$(curl --silent --show-error --output /dev/null --write-out '%{http_code}' "${base_url}${path}")"
  if [ "$actual" != "$expected" ]; then
    echo "${path}: erwartet ${expected}, erhalten ${actual}" >&2
    exit 1
  fi
}

assert_status 200 /healthz
assert_status 200 /
assert_status 200 /kontakt
assert_status 200 /recipe-share/test-token
assert_status 200 /.well-known/assetlinks.json
assert_status 301 /index.html
assert_status 301 /datenschutz.html
assert_status 404 /diese-seite-existiert-nicht

curl --silent --show-error "${base_url}/.well-known/assetlinks.json" | diff - public/.well-known/assetlinks.json
curl --silent --show-error "${base_url}/recipe-share/test-token" | grep -q "planteller://recipe-share"
