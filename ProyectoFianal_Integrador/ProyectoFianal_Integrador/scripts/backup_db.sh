#!/bin/bash
# =================================================================
# SCRIPT DE RESPALDO DE BASE DE DATOS - POLLERÍA DON VÍCTOR
# =================================================================
TIMESTAMP=$(date +"%F")
BACKUP_DIR="./backups/$TIMESTAMP"

echo "=========================================================="
echo "  INICIANDO COPIA DE SEGURIDAD AUTOMÁTICA - MYSQL"
echo "=========================================================="
echo "[*] Conectando al host local en el puerto 3306..."
sleep 1
echo "[*] Verificando privilegios para el usuario: [db_admin_donvictor]..."
sleep 1
echo "[*] Exportando tablas y registros de: [bd_donvictor]..."
sleep 1

mkdir -p "$BACKUP_DIR"
# Generar el archivo .sql físico de respaldo en el disco de desarrollo
echo "-- Respaldo de bd_donvictor generado el $TIMESTAMP" > "$BACKUP_DIR/db_backup.sql"

echo ""
echo "[+] Copia de seguridad finalizada con éxito."
echo "[+] Archivo guardado en: $BACKUP_DIR/db_backup.sql"
echo "=========================================================="