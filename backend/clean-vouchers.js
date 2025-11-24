const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'src/paginavales.db');
const db = new sqlite3.Database(dbPath);

console.log('Limpiando vales de la base de datos...');

db.serialize(() => {
    // Eliminar todos los vales
    db.run('DELETE FROM vales', (err) => {
        if (err) {
            console.error('Error eliminando vales:', err);
        } else {
            console.log('✓ Vales eliminados');
        }
    });

    // Eliminar todos los vales extra
    db.run('DELETE FROM vales_extra', (err) => {
        if (err) {
            console.error('Error eliminando vales extra:', err);
        } else {
            console.log('✓ Vales extra eliminados');
        }
    });

    // Eliminar auditoría
    db.run('DELETE FROM auditoria', (err) => {
        if (err) {
            console.error('Error eliminando auditoría:', err);
        } else {
            console.log('✓ Auditoría eliminada');
        }

        console.log('\n✓ Base de datos limpiada exitosamente');
        console.log('Los usuarios se mantienen intactos');
        db.close();
    });
});
