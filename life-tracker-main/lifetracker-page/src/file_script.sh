#!/bin/bash

for folder in components/*; do
  folder_name=$(basename "$folder")
  touch "$folder/$folder_name.jsx"
  touch "$folder/$folder_name.css"
done
