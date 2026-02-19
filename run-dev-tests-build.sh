#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

APP_PID=""
LOG_FILE="${LOG_FILE:-/tmp/memoryx-api-dev.log}"

cleanup() {
    if [[ -n "$APP_PID" ]] && kill -0 "$APP_PID" 2>/dev/null; then
        kill "$APP_PID" 2>/dev/null || true
        wait "$APP_PID" 2>/dev/null || true
    fi
}

wait_for_server() {
    local port="$1"
    local url="http://127.0.0.1:${port}/"

    for _ in $(seq 1 60); do
        if curl -fsS "$url" >/dev/null 2>&1; then
            return 0
        fi

        if ! kill -0 "$APP_PID" 2>/dev/null; then
            echo "Le serveur dev s'est arrêté de façon inattendue."
            echo "Logs: $LOG_FILE"
            tail -n 80 "$LOG_FILE" || true
            return 1
        fi

        sleep 1
    done

    echo "Timeout: serveur non prêt sur ${url}."
    echo "Logs: $LOG_FILE"
    tail -n 80 "$LOG_FILE" || true
    return 1
}

trap cleanup EXIT INT TERM

echo "[1/7] Installation des dépendances..."
npm install

echo "Création du fichier de configuration temporaire..."
cat >config.json <<EOF
{
    "JWT_SECRET": "secretkey",
    "JWT_EXPIRES_IN": "1h",
    "PORT": 3000,
    "SALT_ROUNDS": 10
}
EOF

echo "Creation du fichier .env temporaire..."
cat >.env <<EOF
DATABASE_URL="file:./dev.db"
EOF

echo "[2/7] Migration de la base..."
npm run migrate

echo "[3/7] Génération Prisma..."
npm run generate

APP_PORT="${PORT:-$(node -e "try { console.log(require('./config.json').PORT || 3000); } catch (_) { console.log(3000); }")}"

echo "[4/7] Démarrage de l'application en mode dev (port ${APP_PORT})..."
npm run dev >"$LOG_FILE" 2>&1 &
APP_PID=$!

echo "[5/7] Attente du serveur..."
wait_for_server "$APP_PORT"

echo "[6/7] Lancement des tests..."
npm run test

echo "[7/7] Arrêt du serveur dev puis build..."
cleanup
APP_PID=""
trap - EXIT INT TERM
npm run build

echo "Pipeline terminé."
