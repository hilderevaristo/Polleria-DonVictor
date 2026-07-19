#!/bin/bash
# =======================================
# SCRIPT DE MANTENIMIENTO PREVENTIVO - LIMPIEZA DE TEMPORALES
# Referencia teorica: Diapositiva de Limpieza de Archivos Temporales
# =======================================

echo "[*] Iniciando depuración periódica de archivos temporales ... "

# Buscar archivos en el directorio temporal y eliminarlos si tienen mas de 7 dias
find ./logs -type f -name " *. log .* " -mtime +7 -exec rm {}} \;

echo "[+] Mantenimiento correctivo de almacenamiento finalizado."