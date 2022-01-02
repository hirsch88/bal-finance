// Datum;Valuta;Typ;Buchungstext;Belastung;Gutschrift;Saldo CHF;Kontonummer;Kontoinhaber;

import { Payment } from './types'

const parseText = (text: string, date: string): string => {
  let value = text.trim()
  if (value.startsWith('" ')) {
    value = value.substring(2)
  }
  if (value.endsWith(' "')) {
    value = value.slice(0, -2)
  }

  value = value.split(date)[0]

  return value
    .trim()
    .replace('Belastung Warenbezug & Dienstleistungen ', '')
    .replace('Vergütung Inland ', '')
}

const newPayment = (row: string): Payment => {
  const props = row.split(';')
  const payment = {
    date: props[0],
    text: parseText(props[3], props[1]),
    type: props[4] === '' ? 'Incomings' : 'Outgoings',
    category: 'Uncategorized',
    amount: parseInt(props[4] === '' ? props[5] : props[4]),
  } as Payment

  return parseCategory(payment)
}

export const parser = (data: string): Payment[] => {
  const rows = data.split('\n')
  rows.shift()
  return rows.map((row) => newPayment(row))
}

const hasPaymentText =
  (payment: Payment) =>
  (search: string[]): boolean =>
    search
      .map((s) =>
        payment.text.toLocaleLowerCase().includes(s.toLocaleLowerCase()),
      )
      .some((s) => s)

const parseCategory = (payment: Payment): Payment => {
  const includes = hasPaymentText(payment)

  if (includes(['MIETE', 'PRIMEO NETZ', 'IMPROWARE'])) {
    payment.category = 'Home'
    return payment
  }

  if (
    includes([
      'STEUERAMT',
      'Steuer',
      'EINWOHNERGEMEINDE',
      'BIO-KIDS',
      'AXA WINTERTHUR',
      'FINANZEN DES KANTONS SOLOTHURN',
    ])
  ) {
    payment.category = 'Finances'
    return payment
  }

  if (
    includes([
      'Gutschrift Basler Versicherung',
      'Gutschrift Finanz- und Kirchendirektion BL',
    ])
  ) {
    payment.category = 'Work'
    return payment
  }

  if (
    includes(['NETFLIX.COM', 'APPLE.COM/BILL', 'Sky Switzerland', 'SPOTIFY'])
  ) {
    payment.category = 'Leisure'
    return payment
  }

  if (
    includes([
      'BABY-WALZ',
      'Ifolor',
      'Digitec',
      'Galaxus',
      'Post CH AG',
      'KARTENMACHEREI',
    ])
  ) {
    payment.category = 'Shopping'
    return payment
  }

  if (includes(['AMAG', 'Parkhäuser', 'BP TS', 'Parking', 'Pakhäuser'])) {
    payment.category = 'Transport'
    return payment
  }

  if (includes(['Apotheke', 'Amavita', 'SWICA'])) {
    payment.category = 'Health'
    return payment
  }

  if (
    includes([
      'Lotus Thai',
      'HELFENSTEIN',
      'AZ Palast',
      'MCDONALDS',
      'Restaurant',
    ])
  ) {
    payment.category = 'Food and drink'
    return payment
  }

  if (
    includes([
      'Denner',
      'Lidl',
      'Avec Express',
      'Coop',
      'Migros',
      'MILCHHUESLI',
      'Fleisch und Feinkost',
      'Nespresso',
    ])
  ) {
    payment.category = 'Household'
    return payment
  }

  return payment
}
