echo Setting up environment
./env/bin/python manage.py gendb sample
./env/bin/python manage.py build

echo Opening terminals
urxvt --hold -e sh -c "cd ./alveott/ && npm start"&disown
urxvt --hold -e sh -c "./env/bin/python manage.py runserver"&disown

echo Opening Firefox
firefox --new-tab http://localhost:4200/ &disown
