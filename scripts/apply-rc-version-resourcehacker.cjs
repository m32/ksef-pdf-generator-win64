const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const rcFilePath = path.resolve(__dirname, '..', 'ksef-pdf-gen.rc');
const exePath = path.resolve(__dirname, '..', 'KSeF-PDFGen.exe');
const resourceHackerPath = process.env.RESOURCE_HACKER_PATH || 'ResourceHacker.exe';

// Sprawdź czy pliki istnieją
if (!fs.existsSync(rcFilePath)) {
  console.error(`Błąd: Plik .rc nie istnieje: ${rcFilePath}`);
  process.exit(1);
}

if (!fs.existsSync(exePath)) {
  console.error(`Błąd: Plik .exe nie istnieje: ${exePath}`);
  console.error('Uruchom najpierw: npm run build:exe');
  process.exit(1);
}

// Sprawdź czy Resource Hacker istnieje
if (!fs.existsSync(resourceHackerPath)) {
  // Sprawdź czy jest w PATH
  try {
    execSync(`where ${resourceHackerPath}`, { stdio: 'ignore' });
  } catch (error) {
    console.error(`Błąd: Resource Hacker nie został znaleziony: ${resourceHackerPath}`);
    console.error('');
    console.error('Instrukcja:');
    console.error('1. Pobierz Resource Hacker z: http://www.angusj.com/resourcehacker/');
    console.error('2. Umieść ResourceHacker.exe w katalogu projektu lub dodaj do PATH');
    console.error('3. Lub ustaw zmienną środowiskową RESOURCE_HACKER_PATH z pełną ścieżką');
    process.exit(1);
  }
}

// Tworzymy kopię zapasową przed modyfikacją
const backupPath = exePath + '.backup';
if (fs.existsSync(backupPath)) {
  fs.unlinkSync(backupPath);
}
fs.copyFileSync(exePath, backupPath);
console.log(`Utworzono kopię zapasową: ${backupPath}`);

try {
  // Resource Hacker wymaga skompilowania pliku .rc do .res
  // Sprawdzamy czy mamy dostęp do rc.exe (z Visual Studio Build Tools)
  const rcExePath = process.env.RC_EXE_PATH || 'rc.exe';
  const resFilePath = path.resolve(__dirname, '..', 'ksef-pdf-gen.res');
  let useResFile = false;
  
  // Próbuj skompilować .rc do .res
  try {
    console.log('Kompilowanie pliku .rc do .res...');
    execSync(`"${rcExePath}" /fo "${resFilePath}" "${rcFilePath}"`, { stdio: 'pipe' });
    if (fs.existsSync(resFilePath)) {
      useResFile = true;
      console.log('✓ Plik .rc skompilowany do .res');
    }
  } catch (rcError) {
    console.log('⚠️  Nie znaleziono rc.exe - próba użycia pliku .rc bezpośrednio...');
    console.log('   Jeśli to nie zadziała, zainstaluj Visual Studio Build Tools lub ustaw RC_EXE_PATH');
  }
  
  console.log('Aktualizowanie metadanych wersji za pomocą Resource Hacker...');
  
  // Usuń istniejący zasób VERSIONINFO i dodaj nowy
  const resourceFile = useResFile ? resFilePath : rcFilePath;
  const resourceType = useResFile ? 'res' : 'rc';
  
  // Najpierw usuń istniejący zasób VERSIONINFO
  const deleteCommand = `"${resourceHackerPath}" -open "${exePath}" -save "${exePath}" -action delete -mask VERSIONINFO,1,`;
  console.log('Usuwanie istniejącego zasobu VERSIONINFO...');
  execSync(deleteCommand, { stdio: 'pipe', cwd: path.dirname(exePath) });
  
  // Dodaj nowy zasób VERSIONINFO z pliku .res lub .rc
  const addCommand = `"${resourceHackerPath}" -open "${exePath}" -save "${exePath}" -action addoverwrite -res "${resourceFile}" -mask VERSIONINFO,1,`;
  console.log(`Dodawanie nowego zasobu VERSIONINFO z pliku ${resourceType}...`);
  execSync(addCommand, { stdio: 'inherit', cwd: path.dirname(exePath) });
  
  // Usuń tymczasowy plik .res jeśli został utworzony
  if (useResFile && fs.existsSync(resFilePath)) {
    fs.unlinkSync(resFilePath);
  }
  
  console.log('✓ Metadane wersji zaktualizowane z pliku .rc');
  console.log(`  - Plik: ${exePath}`);
  console.log(`  - Kopia zapasowa: ${backupPath}`);
  console.log('\n✓ Sprawdź właściwości pliku .exe - powinny zawierać dane z pliku .rc');
  
} catch (error) {
  console.error('Błąd podczas aktualizacji metadanych:', error.message);
  // Przywróć kopię zapasową w przypadku błędu
  if (fs.existsSync(backupPath)) {
    fs.copyFileSync(backupPath, exePath);
    console.log('✓ Przywrócono kopię zapasową');
  }
  process.exit(1);
}

