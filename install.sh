#!/usr/bin/bash
set -v

# Get script directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "Using $DIR as base path"

# Install virtualenv if we don't have it
pip install virtualenv

# Create python virtual environment and activate it
VENVDIR="$DIR/venv"
mkdir "$VENVDIR"
virtualenv -p python2.7 "$VENVDIR"
. "$VENVDIR/bin/activate"

# Upgrade pip
php install --upgrade pip

# Install requirements.txt
pip install -r "$DIR/backend/requirements.txt"

# Create settings.py from the example
echo "\n Typeform API key:"
read typeformKey

echo "\n Typeform FormID:"
read typeformID

cp "$DIR/backend/api/v1/settings.example.py" "$DIR/backend/api/v1/settings.py"
sed -i '' "s|typeformapikey|${typeformKey}|g" $DIR/backend/api/v1/settings.py
sed -i '' "s|typeformformid|${typeformID}|g" $DIR/backend/api/v1/settings.py

echo "Application Manager should be installed now unless you see errors above, now add it to nginx"