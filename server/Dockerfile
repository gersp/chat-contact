FROM openjdk:11

ENTRYPOINT ["sh", "/opt/chatcontact/bin/docker-run.sh"]

VOLUME /etc/chatcontact
VOLUME /var/log/chatcontact

ADD target/chatcontact-server/lib         /opt/chatcontact/lib

ADD target/chatcontact-server/bin         /opt/chatcontact/bin
ADD target/chatcontact-server/migrations  /opt/chatcontact/migrations
ADD target/chatcontact-server/libm        /opt/chatcontact/libm
ADD target/chatcontact-server/conf        /opt/chatcontact/conf

