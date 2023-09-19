#!/usr/bin/env bash

###############################################################
##                    Testing in progress                    ##
##         Aiming to put data into the local fake DB         ##
##       to simplify testing untill real DB is running       ##
###############################################################

  curl 'https://localhost:3000/graphql' \
  -X POST \
  -H 'content-type: application/json' \
  --data '{
    "query":"mutation {
              createUser (createUserInput: {
                nickname: "Alain"
                avatar: "http://dummy.ch/image.png"
              }) {}
            }"
  }'