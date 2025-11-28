#!/bin/bash
cd /home/kavia/workspace/code-generation/ui-components-showcase-4824-4833/frontend_app
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

