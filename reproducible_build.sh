#!/usr/bin/env bash

set -euo pipefail

die(){
    echo "$1" >&2
    exit 1
}

echo "will build reanimated using commit ${COMMIT}"

[ "$(whoami)" = "runner" ] || die 'must be run using user "runner"'

sudo apt update
sudo apt install -y curl git openjdk-11-jdk android-sdk python3 python3-pip wget

if ! yarn --version >/dev/null
then
    [ "${ALLOW_DANGEROUS_INSTALL:-}" ] || die "
    Yarn is missing. Either install it in a secure way or set the
    ALLOW_DANGEROUS_INSTALL env variable
    "
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
    . ~/.nvm/nvm.sh 
    nvm install node
    npm install -g yarn
fi

export ANDROID_NDK_HOME=/tmp/android-ndk-r21d
export ANDROID_NDK=/tmp/android-ndk-r21d
export ANDROID_NDK_LATEST_HOME=/tmp/android-ndk-r21d
export ANDROID_SDK_ROOT=/usr/lib/android-sdk
export ANDROID_HOME=/usr/lib/android-sdk
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
cd /tmp

if [ ! -d "${ANDROID_NDK_HOME}" ]
then
    wget https://dl.google.com/android/repository/android-ndk-r21d-linux-x86_64.zip
    echo 'dd6dc090b6e2580206c64bcee499bc16509a5d017c6952dcd2bed9072af67cbd  android-ndk-r21d-linux-x86_64.zip' | sha256sum -c
    unzip -q android-ndk-r21d-linux-x86_64.zip
    rm android-ndk-r21d-linux-x86_64.zip
fi

if [ ! -d /home/runner/work/react-native-reanimated/react-native-reanimated ]
then
    mkdir -p /home/runner/work/react-native-reanimated/
    cd /home/runner/work/react-native-reanimated/
    git clone https://github.com/ExodusMovement/react-native-reanimated.git
fi
cd /home/runner/work/react-native-reanimated/react-native-reanimated
git checkout "${COMMIT}"

sudo chown -R runner $ANDROID_SDK_ROOT
if [ ! -f "/usr/lib/android-sdk/licenses/android-sdk-license" ]
then
    [ "${ALLOW_DANGEROUS_INSTALL:-}" ] || die "
        Licenses are missing. set the ALLOW_DANGEROUS_INSTALL env variable to
        install an untrusted software and accept it, or copy the
        /usr/lib/android-sdk/licenses/ from other machine.
    "
    pip install --user sdkmanager==0.6.5
    yes | ~/.local/bin/sdkmanager --licenses || true
fi

echo "running build command"
./createNPMPackage.sh
cp *.tgz /tmp/out.tgz
