#!/bin/bash

if [ $# -eq 0 ]
    then
        echo ""
        echo "...starting flask"
        echo "pass --create to install dependencies"
        echo ""
fi

# if [ -z "$1"]
#     then
#         echo "no argument"
# fi

# if [ -d"$1" ]
#     then
#         echo "installing dependencies"
# fi

case $1 in
    --create)  
        # Ok
        echo ""
        echo "...installing dependencies"
        python3 -m pip install --upgrade pip
        pip3 install -r requirements.txt    
        python3 -m venv ../pycomweb
    # *)
    #     # The wrong first argument.
    #     echo 'Expected "a", "b", or "c"' >&2
    #     exit 1
esac


# python3 -m pip install --upgrade pip
# pip3 install -r requirements.txt    
# python3 -m venv ../pycomweb
source ../pycomweb/bin/activate
flask run --debug    