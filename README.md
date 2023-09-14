# p18n

### Configuration

Add scripts in package.json:
```jsonc
{
	"scripts": {
		// Example for a local csv
		"translate:local": "p18n --locales=en,sr,de --out=./i18n/messages --in=./translations.csv",
		// Example when using google sheet to host translations
		"translate:remote": "p18n --locales=en,sr,de --out=./i18n/messages --in='https://docs.google.com/spreadsheets/d/1PWfDNHxkEBRknzssW5T7ihaiXDQFndJtxBr8AbWUxcU/gviz/tq?tqx=out:csv&gid=0'"
	}
}
```

> NOTE: when using google docs, make sure to make the sheet publicly available for reading.



