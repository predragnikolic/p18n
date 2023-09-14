# p18n

Generate translation files based on a CSV file.

### Configuration

Add a `translate` script in package.json:

Example 1 - remote CSV:
```jsonc
{
	"scripts": {
		"translate": "p18n --locales=en,sr,de --out=./i18n/messages --in='https://docs.google.com/spreadsheets/d/1PWfDNHxkEBRknzssW5T7ihaiXDQFndJtxBr8AbWUxcU/gviz/tq?tqx=out:csv&gid=0'"
	}
}
```
> NOTE: when using google docs, make sure to make the sheet publicly available for reading.

Example 2 - local CSV:
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

