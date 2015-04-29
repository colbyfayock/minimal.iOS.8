#!/bin/bash

mkdir Package;

mkdir Package/DEBIAN;
cp control Package/DEBIAN/control;

mkdir Package/Library;
mkdir Package/Library/Themes;
find ./dist -maxdepth 1 -type d -name "minimal.iOS*" -exec cp -r {} Package/Library/Themes/ \;

dpkg-deb -b Package;
mv Package.deb $1.deb

rm -rf Package;

echo "Oh hey, $1.deb should now be good to go!";
