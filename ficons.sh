#!/bin/bash

find . -name "Icon*.png" | awk '{print("mv "$1" "$1)}' | sed 's/Icon/AppIcon/2' | /bin/sh;

find . -name "*29x29*.png" | awk '{print("cp "$1" "$1)}' | sed 's/.png/~ipad.png/2' | /bin/sh;
find . -name "*40x40*.png" | awk '{print("cp "$1" "$1)}' | sed 's/.png/~ipad.png/2' | /bin/sh;
find . -name "*72x72*.png" | awk '{print("cp "$1" "$1)}' | sed 's/.png/~ipad.png/2' | /bin/sh;
find . -name "*76x76*.png" | awk '{print("cp "$1" "$1)}' | sed 's/.png/~ipad.png/2' | /bin/sh;
