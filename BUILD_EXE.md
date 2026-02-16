# Instrukcja kompilacji i uruchamiania aplikacji CLI

## Wymagania

- Node.js w wersji 18 lub wyższej
- npm lub yarn

## Kroki kompilacji

1. **Zainstaluj zależności** (jeśli jeszcze nie zostały zainstalowane):
   ```bash
   npm install
   ```

2. **Skompiluj aplikację**:
   ```bash
   npm run build:cli
   ```

   To polecenie:
   - Skompiluje kod TypeScript do JavaScript (CommonJS)
   - Utworzy pliki JavaScript w katalogu `dist-cli/`

## Użycie skompilowanej aplikacji

### Użycie pliku .exe (Windows)

#### Generowanie faktury PDF:
```bash
ksef-pdf-generator.exe -i invoice.xml -o invoice.pdf -t invoice --nrKSeF "123-2025-ABC" --qrCode "https://example.com/qr"
```

#### Generowanie UPO PDF:
```bash
ksef-pdf-generator.exe -i upo.xml -t upo -o upo.pdf
```

#### Generowanie faktury PDF w strumieniu z użyciem parametrów dla kodu QR:
```bash
ksef-pdf-generator.exe --stream -t invoice --nrKSeF "123-2025-ABC" --qrCode "https://ksef.mf.gov.pl/client-app/invoice/{nip}/{p1}/{hash}" < invoice.xml > invoice.pdf
```

### Pomoc:
```bash
ksef-pdf-generator.exe --help
```

## Parametry

- `-i, --input <ścieżka>` - Ścieżka do pliku XML wejściowego (wymagane w trybie plikowym)
- `-o, --output <ścieżka>` - Ścieżka do pliku PDF wyjściowego (opcjonalne, tylko w trybie plikowym, domyślnie: nazwa pliku wejściowego z rozszerzeniem .pdf)
- `-t, --type <typ>` - Typ dokumentu: `invoice` lub `upo` (wymagane)
- `--nrKSeF <wartość>` - Numer KSeF (wymagane dla faktur)
- `--qrCode <url>` - URL kodu QR (wymagane dla faktur)
- `--stream` - Tryb strumieniowy: XML ze stdin, PDF do stdout
- `-h, --help` - Wyświetla pomoc

## Uwagi

- **Wymagany Node.js**: Aplikacja wymaga zainstalowanego Node.js (v18+) na systemie docelowym
- **Zależności**: Wszystkie zależności muszą być zainstalowane przez `npm install` przed uruchomieniem
- **Tryb strumieniowy**: Tryb strumieniowy (`--stream`) jest idealny do integracji z innymi aplikacjami
- **Komunikaty błędów**: W trybie strumieniowym wszystkie komunikaty błędów są zapisywane do stderr, a dane wyjściowe (PDF) do stdout



