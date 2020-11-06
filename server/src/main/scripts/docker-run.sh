#!/bin/sh

SERVICE_HOME=/opt/chatcontact
SERVICE_CONF_DIR=$SERVICE_HOME/conf
SERVICE_OVERRIDING_DIR=/etc/chatcontact
SERVICE_ENV_CFG=/etc/chatcontact/env.cfg
SERVICE_LOG_DIR=/var/log/chatcontact
SERVICE_TMP_DIR=/tmp

PORT=7000

SERVICE_MAIN_CLASS="chatcontact.ChatContactApplicationKt"

CLASSPATH='/opt/chatcontact/lib/*:/opt/chatcontact/libm/*:'

#set default service parameters
SERVICE_JAVA_XMX=512m
SERVICE_JAVA_MAX_PERM_SIZE=128m

LOG_CONFIG=
LOGGING_CFG=$SERVICE_CONF_DIR/logback.xml
if [ -f $SERVICE_OVERRIDING_DIR/logback.xml ]; then
    LOGGING_CFG=$SERVICE_OVERRIDING_DIR/logback.xml
fi

if [ -f $SERVICE_CONF_DIR/logback.xml ]; then
    LOG_CONFIG="-Dlogging.config=$LOGGING_CFG"
fi

# import overridden definitions from SERVICE_ENV_CFG
if [ -f $SERVICE_ENV_CFG ]; then
    . $SERVICE_ENV_CFG
fi

MEM_OPTS="-Xms$SERVICE_JAVA_XMX -Xmx$SERVICE_JAVA_XMX -XX:MaxMetaspaceSize=$SERVICE_JAVA_MAX_PERM_SIZE"

ADDITIONAL_JVM_OPTS=""

DEFAULT_JVM_OPTS="-XX:+UseCompressedOops\
                  -XX:-OmitStackTraceInFastThrow\
                  -XX:+ExitOnOutOfMemoryError\
                  -XX:+UseG1GC\
                  -XX:+DisableExplicitGC\
                  -XX:+HeapDumpOnOutOfMemoryError\
                  -XX:HeapDumpPath=$SERVICE_LOG_DIR"
#                  -Xlog:gc:$SERVICE_LOG_DIR/gc-%t.log\
#                  -verbose:gc\
#                  -XX:+PrintGC"

JVM_OPTS="$ADDITIONAL_JVM_OPTS $DEFAULT_JVM_OPTS $MEM_OPTS"

JAVA_ENV_OPTS="-Djava.io.tmpdir=$SERVICE_TMP_DIR\
          -Dfile.encoding=UTF-8\
          -Duser.timezone=UTC"

APP_OPTS="-Dlog.dir=$SERVICE_LOG_DIR\
          $LOG_CONFIG\
          -Dspring.config.location=$SERVICE_CONF_DIR/application.yml,$SERVICE_OVERRIDING_DIR/application.yml\
          -Dconfig.location=$SERVICE_CONF_DIR\
          -Dport=$PORT"

ADDITIONAL_APP_OPTS=""

JAVA_ARGS="$JVM_OPTS $JAVA_ENV_OPTS $APP_OPTS $ADDITIONAL_APP_OPTS -cp $CLASSPATH $SERVICE_MAIN_CLASS"

java -Dfile.encoding=UTF-8\
 -Dsql=$SERVICE_HOME/migrations\
 -Dmigration.path=$SERVICE_HOME/migrations\
 -Dspring.profiles.active=migration\
 -Dspring.config.location=$SERVICE_CONF_DIR/application.yml,$SERVICE_OVERRIDING_DIR/application.yml\
 -Dconfig.location=$SERVICE_CONF_DIR\
 -cp $CLASSPATH\
 chatcontact.Migrations $MIGRATIONS

# Command line to start the Java service application
java $JAVA_ARGS
