package com.example.ProyectoFianal_Integrador.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import java.io.BufferedReader;
import java.io.InputStreamReader;

@Component
public class MantenimientoScheduler {

    private static final Logger logger = LoggerFactory.getLogger(MantenimientoScheduler.class);

    // 1. CRON JOB: Automatización del Respaldo de Base de Datos (Todos los días a las 2:00 AM)
    @Scheduled(cron = "0 0 2 * * ?")
    public void ejecutarBackupAutomatico() {
        logger.info("⏰ Cron Job Activado: Iniciando backup automatizado de la base de datos.");
        try {
            // Invocar de manera autónoma el script físico que creaste en la carpeta
            Process process = Runtime.getRuntime().exec("bash ./scripts/backup_db.sh");
            process.waitFor();
            logger.info("✅ Cron Job Success: El script backup_db.sh finalizó su ejecución correctamente.");
        } catch (Exception e) {
            logger.error("❌ Cron Job Error: Fallo al ejecutar el script de respaldo: {}", e.getMessage());
        }
    }

    // 2. CRON JOB: Automatización de Limpieza de Temporales y Logs (Todos los días a las 3:30 AM)
    @Scheduled(cron = "0 30 3 * * ?")
    public void ejecutarLimpiezaAutomatica() {
        logger.info("⏰ Cron Job Activado: Iniciando depuración periódica de almacenamiento preventivo.");
        try {
            Process process = Runtime.getRuntime().exec("bash ./scripts/clean_temp.sh");
            process.waitFor();
            logger.info("✅ Cron Job Success: El script clean_temp.sh finalizó su ejecución correctamente.");
        } catch (Exception e) {
            logger.error("❌ Cron Job Error: Fallo al ejecutar el script de limpieza: {}", e.getMessage());
        }
    }
}