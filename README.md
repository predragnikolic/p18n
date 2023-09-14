# p18n

Generate translation files based on a CSV file.

### Configuration

Add a `translate` script in package.json:

Remote CSV example:
```jsonc
{
  "scripts": {
    "translate": "p18n --locales=en,sr,de --out=./i18n/messages --in='https://docs.google.com/spreadsheets/d/1PWfDNHxkEBRknzssW5T7ihaiXDQFndJtxBr8AbWUxcU/gviz/tq?tqx=out:csv&gid=0'"
  }
}
```
> NOTE: when using google docs, make sure to make the sheet publicly available for reading.

Local CSV example:
```jsonc
{
  "scripts": {
    "translate": "p18n --locales=en,sr,de --out=./i18n/messages --in=./translations.csv",
  }
}
```

Then run `npm run translate`. That will generate the translation files in the `--out` directory.

# Help

Run `npx p18n` to get docs for the available commands.

