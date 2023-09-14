#!/usr/bin/env node
import parseArgs from "args-parser";
import fetch from "node-fetch";
import { parse as parseCsv } from "csv-parse/sync";
import fs from 'fs';

const args = parseArgs(process.argv)

if (Object.keys(args).length === 0) {
  console.log(`
Arguments:
  --in        Path to csv.
  --out       Path to output directory.
  --locales   Comma separated list of locales. The csv must have the locales in the first row!

Example of how to use the command:

p18n --locales=en,sr,de --out=./i18n/messages --in=./translations.csv

p18n --locales=en,sr,de --out=./i18n/messages --in='https://docs.google.com/spreadsheets/d/1PWfDNHxkEBRknzssW5T7ihaiXDQFndJtxBr8AbWUxcU/gviz/tq?tqx=out:csv&gid=0'
`)
  process.exit()
}

if (!args.out || !fs.existsSync(args.out)) {
  console.log(`The out directory "${args.out}" doesn\'t exist. Make sure that the folder exists.`)
  process.exit()
}

const supportedLanguages = args.locales?.split(",") ?? [] // --locales=en,sr,de
  //                   ^^^^^^^^^^^^ language values in the sheet, make sure that they match the value in the sheet

async function main() {
  let textCSV = ''
  if (args.in?.startsWith('https://docs.google.com')) {
    const sheetCSV = await fetch(args.in)
    textCSV = await sheetCSV.text()
  }
  else if (args.in && fs.existsSync(args.in)) {
    textCSV = fs.readFileSync(args.in, { encoding: 'utf8', flag: 'r' })
  }

    console.log(textCSV)
  if (!textCSV) {
    console.log('Could not extract the text for csv. Exiting.')
    return
  }

  parseAndMoveTranslations(textCSV)
}

main()

/** @typedef {{
  KEY: string
  [locale: string]: string
}} TranslationRecord */


/**
 * { function_description }
 *
 * @param      {string}   input   The input
 * @return     {Promise}  { description_of_the_return_value }
 */
async function parseAndMoveTranslations(input) {
  /** @type {TranslationRecord[]} */
  const records = parseCsv(input, {
    columns: true,
    skip_empty_lines: true
  })

  // stop the script if the sheet is missing required header columns
  throwIfMissingRequiredKey(records[0])

  for (const locale of supportedLanguages) {
    /** @type {Record<string, string>} */
    const translations = {
      // will look like
      // "welcome.hello": "hello you {{name}}",
    }

    for (const record of records) {
      const translationKey = record.KEY.trim()
      if (translationKey && !record["en"] ) {
        // skip translations that only have the translation key filled,
        // to allow adding coments int the sheet like:
        //
        // KEY                    | en
        // Users page             |             << this row skipped
        // users_page.create_user | Create user
        // users_page.edit_user   | Edit user
        continue
      }

      if (!translationKey) continue
      //           "welcome.hello" = "hello"
      translations[translationKey] = record[locale]
    }

    // wirte translations to the directory
    fs.writeFileSync(
      `${args.out}/${locale}.json`,
      JSON.stringify(translations, null, 4)
    )
  }
  console.log('Translations are written.')
}

/**
 * @param      {TranslationRecord}  record  The record
 */
function throwIfMissingRequiredKey(record) {
  const requiredKeys = ["KEY", ...supportedLanguages]
  const recordKeys = Object.keys(record)
  for (const requiredKey of requiredKeys) {
    if (!recordKeys.includes(requiredKey)) {
      throw Error(`record is missing the required key: "${requiredKey}".\nThe following keys are reqired: ${requiredKeys.join(", ")}.`)
    }
  }
}