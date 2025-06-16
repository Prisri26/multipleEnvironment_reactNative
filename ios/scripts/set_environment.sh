#!/bin/bash

# Get the scheme name from the environment
SCHEME_NAME="$1"
ENVIRONMENT=""

# Determine environment based on scheme name
if [[ $SCHEME_NAME == *"development"* ]]; then
    ENVIRONMENT="development"
elif [[ $SCHEME_NAME == *"qa"* ]]; then
    ENVIRONMENT="qa"
elif [[ $SCHEME_NAME == *"stage"* ]]; then
    ENVIRONMENT="staging"
else
    ENVIRONMENT="production"
fi

# Export environment variables
export ENVIRONMENT=$ENVIRONMENT
export BUNDLE_IDENTIFIER="com.prithivirajan.baseProjectMultiple.$ENVIRONMENT"

# Print environment info
echo "Setting up environment for: $ENVIRONMENT"
echo "Bundle Identifier: $BUNDLE_IDENTIFIER"

# Create a temporary file with environment info
echo "ENVIRONMENT=$ENVIRONMENT" > "${BUILT_PRODUCTS_DIR}/environment.xcconfig"
echo "BUNDLE_IDENTIFIER=$BUNDLE_IDENTIFIER" >> "${BUILT_PRODUCTS_DIR}/environment.xcconfig" 