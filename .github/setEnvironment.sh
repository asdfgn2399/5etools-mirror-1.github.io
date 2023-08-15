#!/bin/bash

mkdir env
echo "export const environment = { $1, $2, $3, $4, $5, $6, $7 }"  > env/env.js
