if [ -z ${IP+x} ]
then
    IP="0.0.0.0"
fi
mongod --dbpath db --nojournal --bind_ip=$IP --rest