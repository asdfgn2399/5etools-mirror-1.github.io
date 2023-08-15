#!/bin/bash

mkdir env
echo "export const environment = { apiKey: '$1', authDomain: '$2', databaseURL: '$3', projectId: '$4', storageBucket: '$5', messagingSenderId: '$6', appId: '$7' }"  > env/env.js
